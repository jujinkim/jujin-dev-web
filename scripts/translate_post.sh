#!/bin/bash
################################################################################
# translate_post.sh - Translate a blog post using Gemini CLI
#
# USAGE:
#   ./scripts/translate_post.sh <source_file> <target_lang1> [target_lang2...]
#
# ARGUMENTS:
#   source_file     - Path to the source markdown file
#   target_lang     - Target language code(s) (en, ko, ja, etc.)
#
# EXAMPLES:
#   # Translate to English and Japanese
#   ./scripts/translate_post.sh content/my-post.md en ja
#
#   # Translate to Korean only
#   ./scripts/translate_post.sh content/my-post.md ko
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

# Get frontmatter
get_frontmatter() {
    local file="$1"
    awk '/^---$/{if(++count==2) exit} count==1' "$file"
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

    log "Translating $(basename "$source_file") to $target_lang..."

    # Get source language
    local source_lang=$(get_source_lang "$source_file")
    log "Source language: $source_lang"

    # Check if target is same as source
    if [[ "$source_lang" == "$target_lang" ]]; then
        warn "Target language ($target_lang) is same as source language. Skipping."
        return
    fi

    # Prepare output filename
    local dir=$(dirname "$source_file")
    local basename=$(basename "$source_file" .md)
    local output_file="${dir}/${basename}.${target_lang}.md"

    # Check if translation already exists
    if [[ -f "$output_file" ]]; then
        warn "Translation already exists: $output_file"
        read -p "Overwrite? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log "Skipping $target_lang translation"
            return
        fi
    fi

    # Get content to translate
    local title=$(get_title "$source_file")
    local content=$(get_content "$source_file")
    local full_text="# ${title}

${content}"

    # Translate
    log "Calling Gemini CLI for translation..."
    local translated_content=$(translate_text "$source_lang" "$target_lang" "$full_text")

    if [[ -z "$translated_content" ]]; then
        error "Translation failed or returned empty content"
        return 1
    fi

    # Extract translated title (first line after #)
    local translated_title=$(echo "$translated_content" | grep "^#" | head -1 | sed 's/^#[[:space:]]*//')

    # Get content without title
    local translated_body=$(echo "$translated_content" | awk '/^#/{if(++count==1) next} {print}')

    # Build new frontmatter with translated title
    local original_frontmatter=$(get_frontmatter "$source_file")
    local new_frontmatter=$(echo "$original_frontmatter" | sed "s/^title:.*/title: ${translated_title}/" | sed "s/^lang:.*/lang: ${target_lang}/")

    # TODO: Update translations field in frontmatter

    # Write output file
    cat > "$output_file" <<EOF
---
${new_frontmatter}
---
${translated_body}
EOF

    log "Created: $output_file"
}

# Main script
main() {
    if [[ $# -lt 2 ]]; then
        error "Usage: $0 <source_file> <target_lang1> [target_lang2...]"
        error "Example: $0 content/my-post.md en ja"
        exit 1
    fi

    check_requirements

    local source_file="$1"
    shift

    if [[ ! -f "$source_file" ]]; then
        error "Source file not found: $source_file"
        exit 1
    fi

    log "=== Starting translation ==="
    log "Source file: $source_file"
    log "Target languages: $*"
    echo

    for target_lang in "$@"; do
        translate_post "$source_file" "$target_lang"
        echo
    done

    log "=== Translation completed ==="
}

main "$@"
