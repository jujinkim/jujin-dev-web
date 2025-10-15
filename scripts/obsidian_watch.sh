#!/bin/bash
################################################################################
# obsidian_watch.sh - File watcher for automatic sync on changes
#
# USAGE:
#   ./scripts/obsidian_watch.sh [vault_path]
#
# BEHAVIOR:
#   1. Monitors Obsidian vault for file changes using inotifywait
#   2. Debounces changes with 60 second delay
#   3. Runs sync only after no changes for 60 seconds
#   4. Logs all activity to .obsidian_watch.log
#
# REQUIREMENTS:
#   - inotify-tools (install: sudo apt install inotify-tools)
#
# NOTES:
#   - Run this in background or as systemd service
#   - Use obsidian_manage.sh to start/stop watcher
################################################################################

set -euo pipefail

# Load common functions
SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPTS_DIR/obsidian_sync_common.sh"

# Configuration
SOURCE_VAULT="${1:-$DEFAULT_SOURCE_VAULT}"
DEBOUNCE_SECONDS=60
WATCH_LOG="$PROJECT_DIR/.obsidian_watch.log"
SYNC_SCRIPT="$SCRIPTS_DIR/obsidian_manual_sync.sh"

# Logging to watch log
watch_log() {
    echo "[$(date -Iseconds)] $*" | tee -a "$WATCH_LOG"
}

# Check if inotifywait is installed
if ! command -v inotifywait >/dev/null 2>&1; then
    watch_log "ERROR: inotifywait not found. Install with: sudo apt install inotify-tools"
    exit 1
fi

# Validate source vault
if [[ ! -d "$SOURCE_VAULT" ]]; then
    watch_log "ERROR: Source vault not found: $SOURCE_VAULT"
    exit 1
fi

watch_log "=== Starting Obsidian file watcher ==="
watch_log "Watching: $SOURCE_VAULT"
watch_log "Debounce: ${DEBOUNCE_SECONDS}s"
watch_log "Sync script: $SYNC_SCRIPT"

# Track last change time
last_change_time=0
sync_scheduled=0

# Trigger sync after debounce period
trigger_sync() {
    watch_log "No changes for ${DEBOUNCE_SECONDS}s. Triggering sync..."

    if "$SYNC_SCRIPT" "$SOURCE_VAULT" >> "$WATCH_LOG" 2>&1; then
        watch_log "Sync completed successfully"
    else
        watch_log "ERROR: Sync failed with exit code $?"
    fi

    sync_scheduled=0
}

# Monitor vault for changes
inotifywait -m -r \
    --exclude '\.obsidian/' \
    -e modify,create,delete,move,moved_to,moved_from \
    --format '%T %e %w%f' \
    --timefmt '%Y-%m-%dT%H:%M:%S' \
    "$SOURCE_VAULT" 2>/dev/null | while read -r timestamp event filepath; do

    # Extract relative path for cleaner logging
    relative_path="${filepath#$SOURCE_VAULT/}"

    watch_log "Change detected: $event $relative_path"

    # Cancel any pending sync
    if [[ $sync_scheduled -eq 1 ]]; then
        watch_log "Debounce timer reset (${DEBOUNCE_SECONDS}s)"
        # Kill the background sleep if it exists
        if [[ -n "${sync_pid:-}" ]] && kill -0 "$sync_pid" 2>/dev/null; then
            kill "$sync_pid" 2>/dev/null || true
        fi
    fi

    # Schedule new sync
    sync_scheduled=1
    (
        sleep "$DEBOUNCE_SECONDS"
        # Only trigger if still the latest schedule
        if [[ $sync_scheduled -eq 1 ]]; then
            trigger_sync
        fi
    ) &
    sync_pid=$!
done

watch_log "=== File watcher stopped ==="
