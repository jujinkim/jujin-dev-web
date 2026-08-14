#!/bin/bash
################################################################################
# obsidian_sync_common.sh - Shared functions for Obsidian sync scripts
#
# This file contains common logic used by all Obsidian sync scripts.
# Source this file in other scripts: source "$(dirname "$0")/obsidian_sync_common.sh"
################################################################################

# Configuration - auto-detect project directory
SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPTS_DIR/.." && pwd)"
OBSIDIAN_SYNC_ROOT="${OBSIDIAN_SYNC_ROOT:-$HOME/obsidian-vault}"
DEFAULT_SOURCE_VAULT="${DEFAULT_SOURCE_VAULT:-$OBSIDIAN_SYNC_ROOT/dev.jujin.kim-publish}"
OBSIDIAN_SYNC_LOCK_RETRIES="${OBSIDIAN_SYNC_LOCK_RETRIES:-3}"
OBSIDIAN_SYNC_LOCK_RETRY_DELAY="${OBSIDIAN_SYNC_LOCK_RETRY_DELAY:-5}"
SUPPORTED_LANGUAGES=(ko en ja)
TRANSLATION_FILE_LANGUAGES=(ko en ja zh)
LOCKFILE="${SCRIPTS_DIR}/obsidian_publish.lock"
TRANSLATION_CACHE_FILE="$PROJECT_DIR/.translation_cache"

# Ensure expected user-level binary paths are available in non-interactive shells (cron/nohup).
bootstrap_runtime_path() {
    local -a candidate_paths=(
        "$HOME/.npm-global/bin"
        "$HOME/.local/bin"
        "$HOME/bin"
        "/usr/local/bin"
    )

    local dir
    for dir in "${candidate_paths[@]}"; do
        [[ -d "$dir" ]] || continue
        case ":$PATH:" in
            *":$dir:"*) ;;
            *) PATH="$dir:$PATH" ;;
        esac
    done

    export PATH
}

# Logging helper
log() {
    echo "[$(date -Iseconds)] $*"
}

# Cleanup handler
cleanup() {
    if [[ -n "${LOCK_FD:-}" ]]; then
        flock -u "$LOCK_FD" 2>/dev/null || true
    fi
    rm -f "$LOCKFILE"
}

# Translation cache helpers
load_translation_cache() {
    local -n cache_ref=$1

    if [[ -f "$TRANSLATION_CACHE_FILE" ]]; then
        while IFS= read -r line; do
            [[ -z "$line" || "$line" == \#* ]] && continue

            local hash="${line%%$'\t'*}"
            local file="${line#*$'\t'}"

            # Skip malformed entries
            if [[ -z "$file" || "$file" == "$line" ]]; then
                continue
            fi

            cache_ref["$file"]="$hash"
        done < "$TRANSLATION_CACHE_FILE"
    fi
}

save_translation_cache() {
    local -n cache_ref=$1
    local tmp_file

    tmp_file="$(mktemp "${TRANSLATION_CACHE_FILE}.XXXXXX")"

    for file in "${!cache_ref[@]}"; do
        printf '%s\t%s\n' "${cache_ref[$file]}" "$file"
    done | sort -k2 > "$tmp_file"

    mv "$tmp_file" "$TRANSLATION_CACHE_FILE"
}

# Acquire exclusive lock
acquire_lock() {
    exec 200>"$LOCKFILE"
    if ! flock -n 200; then
        log "ERROR: Another instance is running. Exiting."
        exit 1
    fi
    LOCK_FD=200
}

# Validate required commands
validate_requirements() {
    for cmd in git rsync ob; do
        if ! command -v "$cmd" >/dev/null 2>&1; then
            log "ERROR: Required command '$cmd' not found. Install it first."
            exit 1
        fi
    done
}

# Validate paths
validate_paths() {
    local source_vault="$1"
    local target_dir="${2:-$PROJECT_DIR}"

    if ! git -C "$target_dir" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
        log "ERROR: Project directory is not a git repository: $target_dir"
        exit 1
    fi

    if [[ ! -d "$source_vault" ]]; then
        log "ERROR: Source vault not found: $source_vault"
        exit 1
    fi
}

# Verify Obsidian Sync configuration for this machine.
is_obsidian_sync_configured() {
    local vault_root="${1:-$OBSIDIAN_SYNC_ROOT}"

    [[ -d "$vault_root" ]] || return 1
    (
        cd "$vault_root"
        ob sync-status >/dev/null 2>&1
    )
}

# The ob CLI uses this directory as a lease, refreshing its modification time
# every second while a sync is active. A lock younger than five seconds is an
# active competing sync; an older one is safely reclaimed by ob itself.
is_obsidian_sync_lock_active() {
    local vault_root="${1:-$OBSIDIAN_SYNC_ROOT}"
    local lock_dir="$vault_root/.obsidian/.sync.lock"
    local modified_at now

    [[ -d "$lock_dir" ]] || return 1
    modified_at=$(stat -c '%Y' "$lock_dir" 2>/dev/null) || return 1
    now=$(date +%s)

    (( now - modified_at < 5 ))
}

# ob should reclaim an old lease itself, but its timestamp verification can fail
# on filesystems with sub-millisecond timestamp rounding. Remove only an empty,
# inactive lease; an active ob process refreshes its timestamp every second.
clear_stale_obsidian_sync_lock() {
    local vault_root="${1:-$OBSIDIAN_SYNC_ROOT}"
    local lock_dir="$vault_root/.obsidian/.sync.lock"

    [[ -d "$lock_dir" ]] || return 0
    is_obsidian_sync_lock_active "$vault_root" && return 0

    if rmdir -- "$lock_dir"; then
        log "Removed stale Obsidian Sync lease: $lock_dir"
        return 0
    fi

    log "ERROR: Could not remove stale Obsidian Sync lease: $lock_dir"
    return 1
}

# Pull remote Obsidian changes before copying published content into this repository.
sync_obsidian_vault() {
    local vault_root="${1:-$OBSIDIAN_SYNC_ROOT}"
    local attempt=1

    if ! is_obsidian_sync_configured "$vault_root"; then
        log "ERROR: Obsidian Sync is not configured for: $vault_root"
        log "Run: ob sync-setup --path \"$vault_root\""
        exit 1
    fi

    log "Syncing Obsidian vault with ob CLI..."
    log "  Vault root: $vault_root"

    while (( attempt <= OBSIDIAN_SYNC_LOCK_RETRIES )); do
        if is_obsidian_sync_lock_active "$vault_root"; then
            if (( attempt >= OBSIDIAN_SYNC_LOCK_RETRIES )); then
                log "ERROR: Obsidian Sync remained active after ${OBSIDIAN_SYNC_LOCK_RETRIES} attempts"
                exit 1
            fi

            log "Obsidian Sync already active; retrying in ${OBSIDIAN_SYNC_LOCK_RETRY_DELAY}s (${attempt}/${OBSIDIAN_SYNC_LOCK_RETRIES})"
            ((attempt += 1))
            sleep "$OBSIDIAN_SYNC_LOCK_RETRY_DELAY"
            continue
        fi

        if ! clear_stale_obsidian_sync_lock "$vault_root"; then
            exit 1
        fi

        if (
            cd "$vault_root"
            ob sync
        ); then
            log "Obsidian Sync completed"
            return 0
        fi

        if ! is_obsidian_sync_lock_active "$vault_root"; then
            log "ERROR: ob sync failed"
            exit 1
        fi
    done

    log "ERROR: ob sync failed"
    exit 1
}

# Sync vault content
sync_content() {
    local source_vault="$1"
    local target_dir="${2:-$PROJECT_DIR}"

    log "Syncing content from vault to project..."
    log "  Source: $source_vault"
    log "  Target: $target_dir/content"

    if ! rsync -a --delete \
        --exclude='.git' \
        --exclude='.obsidian' \
        --exclude='*.en.md' \
        --exclude='*.ja.md' \
        --exclude='*.zh.md' \
        --stats \
        --partial \
        --human-readable \
        --links \
        --perms \
        --times \
        "$source_vault/" "$target_dir/content/"; then
        log "ERROR: rsync failed"
        exit 1
    fi

    filter_publishable_content "$target_dir"
    log "Sync complete"
}

# Quartz only emits files with publish: true. Keep generated content aligned with that rule.
is_publishable_markdown() {
    local file="$1"
    grep -qEi "^publish:[[:space:]]*[\"']?true[\"']?" "$file"
}

remove_translation_variants() {
    local source_file="$1"
    local lang

    for lang in "${TRANSLATION_FILE_LANGUAGES[@]}"; do
        local variant="${source_file%.md}.${lang}.md"
        [[ -f "$variant" ]] || continue
        rm -f -- "$variant"
    done
}

# rsync cannot filter Markdown by frontmatter. Remove unpublished originals and
# generated translations after copying, while preserving non-Markdown assets.
filter_publishable_content() {
    local target_dir="${1:-$PROJECT_DIR}"
    local content_dir="$target_dir/content"
    local removed_count=0
    local file filename lang original

    while IFS= read -r -d '' file; do
        filename="$(basename "$file")"
        if [[ "$filename" =~ \.(ko|en|ja|zh)\.md$ ]]; then
            continue
        fi

        if ! is_publishable_markdown "$file"; then
            log "  Removing unpublished Markdown: ${file#$content_dir/}"
            rm -f -- "$file"
            remove_translation_variants "$file"
            ((removed_count += 1))
        fi
    done < <(find "$content_dir" -type f -name '*.md' -print0)

    # Translation files are excluded from rsync, so remove variants whose source
    # was deleted from the vault or is no longer publishable.
    while IFS= read -r -d '' file; do
        filename="$(basename "$file")"
        for lang in "${TRANSLATION_FILE_LANGUAGES[@]}"; do
            [[ "$filename" == *."$lang".md ]] || continue
            original="${file%."$lang".md}.md"
            if [[ ! -f "$original" ]] || ! is_publishable_markdown "$original"; then
                log "  Removing orphaned translation: ${file#$content_dir/}"
                rm -f -- "$file"
                ((removed_count += 1))
            fi
            break
        done
    done < <(find "$content_dir" -type f -name '*.md' -print0)

    if [[ $removed_count -gt 0 ]]; then
        log "Removed $removed_count unpublished or orphaned Markdown file(s)"
    fi
}

# Translate changed files
translate_changed_files() {
    local target_dir="${1:-$PROJECT_DIR}"

    cd "$target_dir"

    log "Checking for files to translate..."

    local -A translation_cache=()
    load_translation_cache translation_cache

    local cached_file
    for cached_file in "${!translation_cache[@]}"; do
        if [[ ! -f "$cached_file" ]]; then
            unset 'translation_cache[$cached_file]'
        fi
    done

    mapfile -t candidate_files < <(find content -type f -name '*.md' | sort)

    if [[ ${#candidate_files[@]} -eq 0 ]]; then
        log "No markdown files found under content/"
        return 0
    fi

    local -a files_to_translate=()
    local -A missing_langs_map=()
    local -A file_changed_map=()
    local -A file_hash_map=()
    local cache_dirty=0
    local translation_failed=0

    for file in "${candidate_files[@]}"; do
        [[ -f "$file" ]] || continue

        local basename
        basename=$(basename "$file" .md)
        if [[ "$basename" == *"."* ]]; then
            continue
        fi

        if ! grep -q '^lang:' "$file" 2>/dev/null; then
            continue
        fi

        if ! grep -qEi '^publish:[[:space:]]*["'"'"']?true["'"'"']?' "$file" 2>/dev/null; then
            continue
        fi

        local source_lang
        source_lang=$(grep '^lang:' "$file" | head -1 | sed 's/lang:[[:space:]]*//' | tr -d '"' | tr -d "'")
        local missing_translation=0

        local -a missing_langs=()

        for lang in "${SUPPORTED_LANGUAGES[@]}"; do
            if [[ "$lang" == "$source_lang" ]]; then
                continue
            fi

            local expected
            expected="$(dirname "$file")/${basename}.${lang}.md"
            if [[ ! -f "$expected" ]]; then
                missing_translation=1
                missing_langs+=("$lang")
            fi
        done

        local current_hash
        current_hash=$(sha256sum "$file" | cut -d ' ' -f1)
        file_hash_map["$file"]="$current_hash"

        local cached_hash="${translation_cache[$file]:-}"
        local git_status_line
        git_status_line=$(git status --porcelain -- "$file" 2>/dev/null || true)

        local needs_translation=0
        local file_changed=0

        if [[ $missing_translation -eq 1 ]]; then
            needs_translation=1
        fi

        if [[ -n "$git_status_line" ]]; then
            needs_translation=1
            file_changed=1
        elif [[ -z "$cached_hash" || "$cached_hash" != "$current_hash" ]]; then
            needs_translation=1
            file_changed=1
        fi

        if [[ $needs_translation -eq 1 ]]; then
            files_to_translate+=("$file")
            missing_langs_map["$file"]="${missing_langs[*]}"
            file_changed_map["$file"]=$file_changed
        fi
    done

    if [[ ${#files_to_translate[@]} -eq 0 ]]; then
        log "No markdown files require translation"
        return 0
    fi

    local translate_script="$SCRIPTS_DIR/translate_post.sh"
    if [[ ! -x "$translate_script" ]]; then
        log "WARNING: translate_post.sh not found or not executable. Skipping translations."
        return 0
    fi

    for file in "${files_to_translate[@]}"; do
        [[ -f "$file" ]] || continue

        local basename
        basename=$(basename "$file" .md)
        if [[ "$basename" == *"."* ]]; then
            log "  Skipping translation file: $file"
            continue
        fi

        if ! grep -q '^lang:' "$file" 2>/dev/null; then
            log "  Skipping (no lang field): $file"
            continue
        fi

        if ! grep -qEi '^publish:[[:space:]]*["'"'"']?true["'"'"']?' "$file" 2>/dev/null; then
            log "  Skipping (publish is not true): $file"
            continue
        fi

        local source_lang
        source_lang=$(grep '^lang:' "$file" | head -1 | sed 's/lang:[[:space:]]*//' | tr -d '"' | tr -d "'")

        IFS=' ' read -r -a missing_langs <<< "${missing_langs_map[$file]:-}"
        local file_changed="${file_changed_map[$file]:-0}"

        local -a target_langs=()
        if [[ "$file_changed" -eq 1 ]]; then
            for lang in "${SUPPORTED_LANGUAGES[@]}"; do
                if [[ "$lang" != "$source_lang" ]]; then
                    target_langs+=("$lang")
                fi
            done
        else
            target_langs=("${missing_langs[@]}")
        fi

        if [[ ${#target_langs[@]} -eq 0 ]]; then
            log "  Skipping (no target languages needed): $file"
            continue
        fi

        log "  Translating: $file (${target_langs[*]})"
        if TRANSLATE_SKIP_GIT=1 "$translate_script" "$file" "${target_langs[@]}" 2>&1 | sed 's/^/    /'; then
            log "  ✓ Translation successful"
            local updated_hash
            updated_hash=$(sha256sum "$file" | cut -d ' ' -f1)
            translation_cache["$file"]="$updated_hash"
            cache_dirty=1
        else
            log "  ✗ Translation failed (continuing anyway)"
            translation_failed=1
        fi
    done

    if [[ $cache_dirty -eq 1 ]]; then
        save_translation_cache translation_cache
    fi

    if [[ $translation_failed -ne 0 ]]; then
        log "Translation processing failed"
        return 1
    fi

    log "Translation processing complete"
}

ensure_publish_worktree_is_clean() {
    local status
    status="$(git status --porcelain -- . ':(exclude)content' ':(exclude).translation_cache')"

    if [[ -z "$status" ]]; then
        return 0
    fi

    log "ERROR: Unrelated worktree changes block automatic publish:"
    printf '%s\n' "$status" | sed 's/^/  /'
    return 1
}

# Commit and push changes
commit_and_push() {
    local commit_message="$1"
    local target_dir="${2:-$PROJECT_DIR}"

    cd "$target_dir"

    if ! ensure_publish_worktree_is_clean; then
        return 1
    fi

    local -a publish_paths=(content)
    if [[ -e "$TRANSLATION_CACHE_FILE" ]] || git ls-files --error-unmatch "$TRANSLATION_CACHE_FILE" >/dev/null 2>&1; then
        publish_paths+=("$TRANSLATION_CACHE_FILE")
    fi

    git add -A -- "${publish_paths[@]}"

    if git diff --cached --quiet -- "${publish_paths[@]}"; then
        log "No changes to publish"
        return 0
    fi

    log "Changes detected. Committing and pushing..."

    if ! git commit --only -m "$commit_message" -- "${publish_paths[@]}"; then
        log "ERROR: Git commit failed"
        exit 1
    fi

    # Determine branch and push
    local branch
    branch="$(git rev-parse --abbrev-ref HEAD)"
    log "Preparing to rebase and push branch: $branch"

    if git rev-parse --abbrev-ref --symbolic-full-name @{u} >/dev/null 2>&1; then
        log "Rebasing onto upstream before push..."
        if ! git pull --rebase; then
            log "ERROR: Git pull --rebase failed"
            exit 1
        fi
        # Upstream exists
        if ! git push; then
            log "ERROR: Git push failed"
            exit 1
        fi
    else
        log "No upstream configured. Skipping pull --rebase."
        # No upstream, push to origin
        if ! git push origin "$branch"; then
            log "ERROR: Git push to origin failed"
            exit 1
        fi
    fi

    log "Successfully pushed changes"
    return 0
}

# Main sync workflow
run_sync() {
    local source_vault="$1"
    local commit_message="$2"

    trap cleanup EXIT INT TERM

    bootstrap_runtime_path
    acquire_lock
    validate_requirements
    validate_paths "$source_vault"

    sync_obsidian_vault "$OBSIDIAN_SYNC_ROOT"
    sync_content "$source_vault"
    translate_changed_files "$PROJECT_DIR"
    commit_and_push "$commit_message"
}
