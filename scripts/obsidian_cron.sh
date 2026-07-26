#!/bin/bash
################################################################################
# obsidian_cron.sh - Automated Obsidian → Git publish workflow (for cron)
#
# USAGE:
#   Run from cron every 6 hours.
#
#   Crontab example:
#   0 */6 * * * /path/to/scripts/obsidian_cron.sh >> /path/to/.obsidian_publish.log 2>&1
#
# BEHAVIOR:
#   1. Acquires exclusive lock to prevent concurrent runs
#   2. Pulls remote vault changes using ob CLI
#   3. Syncs published vault content to project using rsync --delete
#   4. Commits and pushes changes to git if any exist
#
# NOTE:
#   Use obsidian_manage.sh to enable/disable this cron job.
################################################################################

set -euo pipefail

# Load common functions
SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPTS_DIR/obsidian_sync_common.sh"

# Configuration
SOURCE_VAULT="${1:-$DEFAULT_SOURCE_VAULT}"

# Commit message for automated runs
COMMIT_MESSAGE="Publish update from Obsidian vault

Automated sync at $(date -Iseconds)

🤖 Generated with obsidian_cron.sh"

# Run the sync
log "=== Starting Obsidian auto-sync ==="
run_sync "$SOURCE_VAULT" "$COMMIT_MESSAGE"
log "=== Auto-sync completed successfully ==="
exit 0
