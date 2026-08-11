#!/bin/bash
################################################################################
# translate_post.sh - Translate a blog post using Antigravity CLI
#
# USAGE:
#   ./scripts/translate_post.sh <source_file> [target_langs...]
#
# REQUIREMENTS:
#   - Antigravity CLI (`agy`) must be installed and available in PATH
#   - Source file must have 'lang' field in frontmatter
################################################################################

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SUPPORTED_LANGUAGES=("ko" "en" "ja")
generated_files=()
AGY_BIN="${AGY_BIN:-}"
AGY_MODEL="${AGY_MODEL:-}"

log() {
    echo -e "${GREEN}[$(date +%H:%M:%S)]${NC} $*"
}

error() {
    echo -e "${RED}[ERROR]${NC} $*" >&2
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $*"
}

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

resolve_agy_bin() {
    if [[ -n "$AGY_BIN" && -x "$AGY_BIN" ]]; then
        return 0
    fi

    if AGY_BIN="$(command -v agy 2>/dev/null)"; then
        return 0
    fi

    local -a candidate_bins=(
        "$HOME/.local/bin/agy"
        "$HOME/.npm-global/bin/agy"
        "$HOME/bin/agy"
    )

    local bin
    for bin in "${candidate_bins[@]}"; do
        if [[ -x "$bin" ]]; then
            AGY_BIN="$bin"
            return 0
        fi
    done

    return 1
}

# Check requirements
check_requirements() {
    bootstrap_runtime_path
    if ! resolve_agy_bin; then
        error "Antigravity CLI ('agy') not found. Please install it first."
        exit 1
    fi
}

# Extract source language from frontmatter
get_source_lang() {
    local file="$1"
    local lang=$(grep "^lang:" "$file" | head -1 | sed 's/lang:[[:space:]]*//' | tr -d '"' | tr -d "'")

    if [[ -z "$lang" ]]; then
        error "No 'lang' field found in frontmatter of $file"
        exit 1
    fi

    echo "$lang"
}

# Extract title from frontmatter
get_title() {
    local file="$1"
    local title=$(grep "^title:" "$file" | head -1 | sed 's/title:[[:space:]]*//' | tr -d '"')

    echo "$title"
}

# Extract content (without frontmatter)
get_content() {
    local file="$1"
    # Capture everything after the second frontmatter delimiter.
    # Later '---' lines in the body are valid markdown separators and must be preserved.
    awk '
    BEGIN { delim_count=0; in_body=0 }
    /^---$/ {
        if (delim_count < 2) {
            delim_count++
            if (delim_count == 2) {
                in_body=1
            }
            next
        }
    }
    in_body { print }
    ' "$file"
}

# Get frontmatter (without the --- delimiters)
get_frontmatter() {
    local file="$1"
    awk '/^---$/{if(++count==1) next; if(count==2) exit} {print}' "$file"
}

# Remove translations field from frontmatter if it exists
remove_translations_field() {
    local file="$1"

    if [[ ! -f "$file" ]]; then
        return
    fi

    if ! grep -q "^translations:" "$file"; then
        return
    fi

    local temp_file="${file}.tmp"

    awk '
    BEGIN { section = 0; skip = 0 }
    /^---$/ {
        section++
        skip = (section == 1) ? skip : 0
        print
        next
    }
    {
        if (section != 1) {
            print
            next
        }

        if (skip) {
            if ($0 ~ /^[[:space:]]+/) {
                next
            }
            if ($0 ~ /^[[:space:]]*$/) {
                next
            }
            skip = 0
        }

        if (skip) {
            next
        }

        if (/^translations:/) {
            skip = 1
            next
        }

        print
    }
    ' "$file" > "$temp_file"

    mv "$temp_file" "$file"
}

# Extract section content between explicit markers.
# Example marker block:
#   [[[TITLE]]]
#   ...
#   [[[/TITLE]]]
extract_marked_section() {
    local text="$1"
    local section="$2"
    local start_marker="[[[${section}]]]"
    local end_marker="[[[/${section}]]]"

    printf '%s\n' "$text" | awk -v start="$start_marker" -v end="$end_marker" '
    $0 == start { capture=1; next }
    $0 == end { capture=0; exit }
    capture { print }
    '
}

# Build frontmatter for translation with back-reference to original
build_translation_frontmatter() {
    local source_file="$1"
    local target_lang="$2"
    local translated_title="$3"

    # Get original frontmatter and source language
    local original_frontmatter=$(get_frontmatter "$source_file")
    # Calculate original slug (without .md extension)
    local new_frontmatter=$(echo "$original_frontmatter" | awk -v title="$translated_title" -v lang="$target_lang" '
    BEGIN { in_trans=0; title_set=0; lang_set=0 }
    /^translations:/ { in_trans=1; next }
    /^(created|modified|published):/ { next }
    in_trans && /^[[:space:]]+/ { next }
    in_trans && /^[[:space:]]*$/ { next }
    {
        if (in_trans) {
            in_trans=0
        }
        if (/^title:/) {
            print "title: \"" title "\""
            title_set=1
            next
        }
        if (/^lang:/) {
            print "lang: " lang
            lang_set=1
            next
        }
        print
    }
    END {
        if (!title_set && title != "") {
            print "title: \"" title "\""
        }
        if (!lang_set) {
            print "lang: " lang
        }
    }
    ')

    echo "$new_frontmatter"
}

# Translate using Antigravity CLI. Print mode returns translation without file edits.
translate_text() {
    local source_lang="$1"
    local target_lang="$2"
    local title="$3"
    local body="$4"

    local prompt="Translate the following blog post from ${source_lang} to ${target_lang}.

Rules:
1) Keep markdown formatting, links, and code blocks unchanged.
2) Translate only human-readable prose.
3) Keep technical terms, commands, file paths, and URLs as-is when appropriate.
4) Preserve heading structure. Do not remove headings even if a section is short or empty.
5) Do not include frontmatter.
6) Do not include any commentary or explanation.
7) Do not use tools, commands, file operations, or workspace inspection.
8) Output must be exactly in this format:
[[[TITLE]]]
<translated title, single line, no leading #>
[[[/TITLE]]]
[[[BODY]]]
<translated markdown body only, without frontmatter and without the title heading>
[[[/BODY]]]

Source title:
${title}

Source body:
${body}"

    local -a agy_args=(--mode plan)
    if [[ -n "$AGY_MODEL" ]]; then
        agy_args+=(--model "$AGY_MODEL")
    fi
    agy_args+=(--print "$prompt")

    "$AGY_BIN" "${agy_args[@]}"
}

# Main translation logic
translate_post() {
    local source_file="$1"
    local target_lang="$2"

    local source_lang=$(get_source_lang "$source_file")

    log "Translating $(basename "$source_file") to $target_lang..."
    log "Source language: $source_lang"

    if [[ "$source_lang" == "$target_lang" ]]; then
        warn "Target language ($target_lang) is same as source language. Skipping."
        return
    fi

    local dir=$(dirname "$source_file")
    local basename=$(basename "$source_file" .md)
    local output_file="${dir}/${basename}.${target_lang}.md"

    if [[ -f "$output_file" ]]; then
        remove_translations_field "$output_file"
        warn "Translation already exists: $output_file"
        log "Overwriting existing translation."
    fi

    local title=$(get_title "$source_file")
    local content=$(get_content "$source_file")
    log "Calling Antigravity CLI for translation..."
    local translated_content
    translated_content=$(translate_text "$source_lang" "$target_lang" "$title" "$content")

    if [[ -z "$translated_content" ]]; then
        error "Translation failed or returned empty content"
        return 1
    fi

    local translated_title
    translated_title="$(extract_marked_section "$translated_content" "TITLE" | sed '/^[[:space:]]*$/d' | head -1)"

    local translated_body
    translated_body="$(extract_marked_section "$translated_content" "BODY")"

    # Fallback parser for legacy/non-structured model outputs.
    if [[ -z "$translated_title" || -z "$translated_body" ]]; then
        warn "Structured output parsing failed. Falling back to legacy heading parser."

        local last_h1_line
        last_h1_line="$(printf '%s\n' "$translated_content" | awk '/^# /{line=NR} END{if(line) print line}')"

        if [[ -z "$last_h1_line" ]]; then
            error "Could not parse translated output (no markers and no H1 heading found)."
            return 1
        fi

        translated_title="$(printf '%s\n' "$translated_content" | sed -n "${last_h1_line}p" | sed 's/^#[[:space:]]*//')"
        translated_body="$(printf '%s\n' "$translated_content" | awk -v start="$last_h1_line" 'NR > start { print }')"
    fi

    if [[ -z "$translated_title" ]]; then
        warn "Translated title is empty. Falling back to source title."
        translated_title="$title"
    fi

    if [[ -z "$translated_body" ]]; then
        error "Translated body is empty after parsing."
        return 1
    fi

    local new_frontmatter=$(build_translation_frontmatter "$source_file" "$target_lang" "$translated_title")

    cat > "$output_file" <<EOF
---
${new_frontmatter}
---
${translated_body}
EOF

    remove_translations_field "$output_file"

    log "Created: $output_file"
    generated_files+=("$output_file")
}

# Main script
main() {
    if [[ $# -lt 1 ]]; then
        error "Usage: $0 <source_file> [target_langs...]"
        exit 1
    fi

    check_requirements

    local source_file="$1"
    shift

    local user_target_langs=("$@")

    if [[ ! -f "$source_file" ]]; then
        error "Source file not found: $source_file"
        exit 1
    fi

    local source_lang=$(get_source_lang "$source_file")

    local source_supported=false
    for lang in "${SUPPORTED_LANGUAGES[@]}"; do
        if [[ "$lang" == "$source_lang" ]]; then
            source_supported=true
            break
        fi
    done

    if [[ "$source_supported" == false ]]; then
        warn "Source language '${source_lang}' is outside the supported set (${SUPPORTED_LANGUAGES[*]}). Proceeding with fixed targets."
    fi

    remove_translations_field "$source_file"

    local target_langs=()
    if [[ ${#user_target_langs[@]} -gt 0 ]]; then
        # Use only user-specified target languages that are supported and not the source
        for lang in "${user_target_langs[@]}"; do
            if [[ "$lang" == "$source_lang" ]]; then
                continue
            fi

            local valid=false
            for supported in "${SUPPORTED_LANGUAGES[@]}"; do
                if [[ "$supported" == "$lang" ]]; then
                    valid=true
                    break
                fi
            done

            if [[ "$valid" == true ]]; then
                target_langs+=("$lang")
            else
                warn "Skipping unsupported target language: $lang"
            fi
        done

        if [[ ${#target_langs[@]} -eq 0 ]]; then
            warn "No valid target languages provided; falling back to supported set: ${SUPPORTED_LANGUAGES[*]}"
        fi
    fi

    if [[ ${#target_langs[@]} -eq 0 ]]; then
        for lang in "${SUPPORTED_LANGUAGES[@]}"; do
            if [[ "$lang" != "$source_lang" ]]; then
                target_langs+=("$lang")
            fi
        done
    fi

    if [[ ${#target_langs[@]} -eq 0 ]]; then
        warn "No target languages determined for $source_file (source lang: $source_lang). Nothing to do."
        return 0
    fi

    generated_files=()
    local all_success=true

    log "=== Starting translation ==="
    log "Source file: $source_file (lang: $source_lang)"
    log "Target languages: ${target_langs[*]}"
    echo

    for target_lang in "${target_langs[@]}"; do
        if ! translate_post "$source_file" "$target_lang"; then
            warn "Translation failed for target language: $target_lang"
            all_success=false
        fi
        echo
    done

    if "$all_success"; then
        if [[ "${TRANSLATE_SKIP_GIT:-0}" == "1" ]]; then
            log "All translations completed successfully. Skipping commit/push (TRANSLATE_SKIP_GIT=1)."
        else
            log "All translations completed successfully. Preparing to commit changes..."

            git add "$source_file" >/dev/null 2>&1 || true
            if [[ ${#generated_files[@]} -gt 0 ]]; then
                git add "${generated_files[@]}" >/dev/null 2>&1 || true
            fi

            if git diff --cached --quiet; then
                log "No changes detected to commit after translation."
            else
                local basename
                basename=$(basename "$source_file")
                local commit_message="Translate ${basename} to ${target_langs[*]}"

                if git commit -m "$commit_message"; then
                    log "Committed translation changes."

                    local branch
                    branch="$(git rev-parse --abbrev-ref HEAD)"

                    if git rev-parse --abbrev-ref --symbolic-full-name @{u} >/dev/null 2>&1; then
                        if git push; then
                            log "Pushed translation commit to remote."
                        else
                            warn "Git push failed. Please push manually."
                        fi
                    else
                        if git push origin "$branch"; then
                            log "Pushed translation commit to origin/${branch}."
                        else
                            warn "Git push to origin/${branch} failed. Please push manually."
                        fi
                    fi
                else
                    warn "Git commit failed. Please resolve any issues and commit manually."
                fi
            fi
        fi
    else
        warn "Skipping commit/push because one or more translations failed."
    fi

    log "=== Translation completed ==="
}

main "$@"
