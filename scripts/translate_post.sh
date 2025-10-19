#!/bin/bash
################################################################################
# translate_post.sh - Translate a blog post using Gemini CLI
#
# USAGE:
#   ./scripts/translate_post.sh <source_file>
#
# REQUIREMENTS:
#   - Gemini CLI must be installed and available in PATH
#   - Source file must have 'lang' field in frontmatter
################################################################################

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SUPPORTED_LANGUAGES=("ko" "en" "ja" "zh")

log() {
    echo -e "${GREEN}[$(date +%H:%M:%S)]${NC} $*"
}

error() {
    echo -e "${RED}[ERROR]${NC} $*" >&2
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $*"
}

# Check requirements
check_requirements() {
    if ! command -v gemini &> /dev/null; then
        error "Gemini CLI not found. Please install it first."
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
    # Skip first frontmatter block (between --- and ---) and get the rest
    awk '/^---$/{if(++count==2) {getline; print; next}} count==2' "$file"
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

# Translate using Gemini CLI
translate_text() {
    local source_lang="$1"
    local target_lang="$2"
    local text="$3"

    local prompt="Translate the following markdown content from ${source_lang} to ${target_lang}.
Keep all markdown formatting, links, and code blocks unchanged.
Only translate the actual text content, not code, URLs, or technical terms that should remain in English.
Do not add any explanations or notes, just output the translated markdown.

Content to translate:
${text}"

    gemini -p "$prompt"
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
        read -p "Overwrite? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log "Skipping $target_lang translation"
            return
        fi
    fi

    local title=$(get_title "$source_file")
    local content=$(get_content "$source_file")
    local full_text="# ${title}

${content}"

    log "Calling Gemini CLI for translation..."
    local translated_content=$(translate_text "$source_lang" "$target_lang" "$full_text")

    if [[ -z "$translated_content" ]]; then
        error "Translation failed or returned empty content"
        return 1
    fi

    local translated_title=$(echo "$translated_content" | grep "^#" | head -1 | sed 's/^#[[:space:]]*//')
    local translated_body=$(echo "$translated_content" | awk '/^#/{if(++count==1) next} {print}')
    local new_frontmatter=$(build_translation_frontmatter "$source_file" "$target_lang" "$translated_title")

    cat > "$output_file" <<EOF
---
${new_frontmatter}
---
${translated_body}
EOF

    remove_translations_field "$output_file"

    log "Created: $output_file"
}

# Main script
main() {
    if [[ $# -lt 1 ]]; then
        error "Usage: $0 <source_file>"
        exit 1
    fi

    check_requirements

    local source_file="$1"

    if [[ ! -f "$source_file" ]]; then
        error "Source file not found: $source_file"
        exit 1
    fi

    shift
    if [[ $# -gt 0 ]]; then
        warn "Ignoring explicit language arguments. Using supported set: ${SUPPORTED_LANGUAGES[*]}"
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
    for lang in "${SUPPORTED_LANGUAGES[@]}"; do
        if [[ "$lang" != "$source_lang" ]]; then
            target_langs+=("$lang")
        fi
    done

    if [[ ${#target_langs[@]} -eq 0 ]]; then
        warn "No target languages determined for $source_file (source lang: $source_lang). Nothing to do."
        return 0
    fi

    log "=== Starting translation ==="
    log "Source file: $source_file (lang: $source_lang)"
    log "Target languages: ${target_langs[*]}"
    echo

    for target_lang in "${target_langs[@]}"; do
        translate_post "$source_file" "$target_lang"
        echo
    done

    log "=== Translation completed ==="
}

main "$@"
