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
DEFAULT_SOURCE_VAULT="$HOME/Obsidian Vault/dev.jujin.kim-publish"
SUPPORTED_LANGUAGES=(ko en ja zh)
INIT_WAIT_SECONDS=30
LOCKFILE="${SCRIPTS_DIR}/obsidian_publish.lock"
TRANSLATION_CACHE_FILE="$PROJECT_DIR/.translation_cache"

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
    for cmd in xvfb-run git rsync; do
        if ! command -v "$cmd" >/dev/null 2>&1; then
            log "ERROR: Required command '$cmd' not found. Install it first."
            exit 1
        fi
    done

    OBSIDIAN_BIN="$(which obsidian 2>/dev/null || echo "/usr/bin/obsidian")"
    if [[ ! -x "$OBSIDIAN_BIN" ]]; then
        log "ERROR: Obsidian binary not found at $OBSIDIAN_BIN"
        exit 1
    fi
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

# Check if Obsidian is running
is_obsidian_running() {
    pgrep -x "obsidian" >/dev/null 2>&1 || pidof obsidian >/dev/null 2>&1
}

# Start Obsidian headlessly
start_obsidian() {
    log "Obsidian not running. Starting headlessly..."

    xvfb-run -a --server-args='-screen 0 1920x1080x24' "$OBSIDIAN_BIN" --disable-gpu >/dev/null 2>&1 &
    local pid=$!

    log "Started Obsidian with PID $pid. Waiting ${INIT_WAIT_SECONDS}s for initialization..."
    sleep "$INIT_WAIT_SECONDS"

    # Verify process is still alive
    if ! kill -0 "$pid" 2>/dev/null; then
        log "ERROR: Obsidian process died during initialization"
        exit 1
    fi

    log "Obsidian initialized successfully"
    echo "$pid"
}

# Shutdown Obsidian
shutdown_obsidian() {
    local pid="$1"

    if [[ -z "$pid" ]]; then
        return
    fi

    log "Shutting down Obsidian (PID $pid)..."

    if kill "$pid" 2>/dev/null; then
        # Wait up to 5 seconds for graceful shutdown
        for i in {1..5}; do
            if ! kill -0 "$pid" 2>/dev/null; then
                log "Obsidian shut down gracefully"
                return
            fi
            sleep 1
        done

        # Force kill if still alive
        if kill -0 "$pid" 2>/dev/null; then
            log "Force killing Obsidian..."
            kill -9 "$pid" 2>/dev/null || true
        fi
    fi
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

    log "Sync complete"
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
    local -A file_hash_map=()
    local cache_dirty=0

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

        local source_lang
        source_lang=$(grep '^lang:' "$file" | head -1 | sed 's/lang:[[:space:]]*//' | tr -d '"' | tr -d "'")
        local missing_translation=0

        for lang in "${SUPPORTED_LANGUAGES[@]}"; do
            if [[ "$lang" == "$source_lang" ]]; then
                continue
            fi

            local expected
            expected="$(dirname "$file")/${basename}.${lang}.md"
            if [[ ! -f "$expected" ]]; then
                missing_translation=1
                break
            fi
        done

        local current_hash
        current_hash=$(sha256sum "$file" | cut -d ' ' -f1)
        file_hash_map["$file"]="$current_hash"

        local cached_hash="${translation_cache[$file]:-}"
        local needs_translation=0

        if [[ $missing_translation -eq 1 ]]; then
            needs_translation=1
        elif [[ -z "$cached_hash" || "$cached_hash" != "$current_hash" ]]; then
            needs_translation=1
        fi

        if [[ $needs_translation -eq 1 ]]; then
            files_to_translate+=("$file")
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

        log "  Translating: $file (ko/en/ja/zh)"
        if "$translate_script" "$file" 2>&1 | sed 's/^/    /'; then
            log "  ✓ Translation successful"
            translation_cache["$file"]="${file_hash_map[$file]}"
            cache_dirty=1
        else
            log "  ✗ Translation failed (continuing anyway)"
        fi
    done

    if [[ $cache_dirty -eq 1 ]]; then
        save_translation_cache translation_cache
        git add "$TRANSLATION_CACHE_FILE" 2>/dev/null || true
    fi

    git add content 2>/dev/null || true

    log "Translation processing complete"
}

# Commit and push changes
commit_and_push() {
    local commit_message="$1"
    local target_dir="${2:-$PROJECT_DIR}"

    cd "$target_dir"

    if [[ -z "$(git status --porcelain)" ]]; then
        log "No changes to publish"
        return 1
    fi

    log "Changes detected. Committing and pushing..."

    git add -A

    if ! git commit -m "$commit_message"; then
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

    acquire_lock
    validate_requirements
    validate_paths "$source_vault"

    local started_by_script=0
    local obs_pid=""

    if is_obsidian_running; then
        log "Obsidian is already running. Proceeding with sync..."
    else
        started_by_script=1
        obs_pid=$(start_obsidian)
    fi

    sync_content "$source_vault"
    translate_changed_files "$PROJECT_DIR"
    commit_and_push "$commit_message"

    if [[ $started_by_script -eq 1 && -n "$obs_pid" ]]; then
        shutdown_obsidian "$obs_pid"
    fi
}
