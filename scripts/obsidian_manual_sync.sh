#!/bin/bash
################################################################################
# obsidian_manual_sync.sh - Manual Obsidian → Git publish workflow
#
# USAGE:
#   ./scripts/obsidian_manual_sync.sh [vault_dir]
#
# ARGUMENTS:
#   vault_dir     - Path to Obsidian vault publish directory
#                   Default: "$HOME/Obsidian Vault/dev.jujin.kim-publish"
#
# EXAMPLES:
#   # Use default vault path
#   ./scripts/obsidian_manual_sync.sh
#
#   # Custom vault path
#   ./scripts/obsidian_manual_sync.sh "$HOME/Obsidian Vault/dev.jujin.kim-publish"
################################################################################

set -euo pipefail

# Load common functions
SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPTS_DIR/obsidian_sync_common.sh"

# Configuration
SOURCE_VAULT="${1:-$DEFAULT_SOURCE_VAULT}"

# Commit message for manual runs
COMMIT_MESSAGE="Publish update from Obsidian vault (manual)

Manual sync at $(date -Iseconds)

🤖 Generated with obsidian_manual_sync.sh"

# Run the sync
log "=== Starting Obsidian manual sync ==="
log "Source vault: $SOURCE_VAULT"
run_sync "$SOURCE_VAULT" "$COMMIT_MESSAGE"
log "=== Manual sync completed successfully ==="
exit 0
