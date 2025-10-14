#!/bin/bash
################################################################################
# obsidian_manual_sync.sh - Manual Obsidian → Git publish workflow
#
# USAGE:
#   ./scripts/obsidian_manual_sync.sh [vault_dir]
#
# ARGUMENTS:
#   vault_dir     - Path to Obsidian vault publish directory
#                   Default: "$HOME/Obsidian Vault/jujin.dev-publish"
#
# EXAMPLES:
#   # Use default vault path
#   ./scripts/obsidian_manual_sync.sh
#
#   # Custom vault path
#   ./scripts/obsidian_manual_sync.sh "$HOME/Obsidian Vault/jujin.dev-publish"
#
# BEHAVIOR:
#   1. Acquires exclusive lock to prevent concurrent runs
#   2. Checks if Obsidian is running; starts headlessly if not
#   3. Waits INIT_WAIT_SECONDS (30s) for initialization if started
#   4. Syncs vault content to project using rsync --delete
#   5. Commits and pushes changes to git if any exist
#   6. Shuts down Obsidian if script started it
#
# REQUIREMENTS:
#   - xvfb-run, git, rsync, obsidian
#
# WARNING:
#   Uses rsync --delete which removes files in target not present in source!
################################################################################

set -euo pipefail

# Configuration - auto-detect project directory
SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPTS_DIR/.." && pwd)"
SOURCE_VAULT="${1:-$HOME/Obsidian Vault/jujin.dev-publish}"
INIT_WAIT_SECONDS=30
LOCKFILE="${SCRIPTS_DIR}/obsidian_publish.lock"

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

trap cleanup EXIT INT TERM

# Acquire exclusive lock
exec 200>"$LOCKFILE"
if ! flock -n 200; then
    log "ERROR: Another instance is running. Exiting."
    exit 1
fi
LOCK_FD=200

log "=== Starting Obsidian manual sync ==="
log "Source vault: $SOURCE_VAULT"

# Validate required commands
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

# Validate project directory is a git repo
TARGET_DIR="$PROJECT_DIR"
if ! git -C "$TARGET_DIR" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    log "ERROR: Project directory is not a git repository: $TARGET_DIR"
    exit 1
fi

# Validate source vault exists
if [[ ! -d "$SOURCE_VAULT" ]]; then
    log "ERROR: Source vault not found: $SOURCE_VAULT"
    exit 1
fi

# Check if Obsidian is already running
STARTED_BY_SCRIPT=0
OBS_PID=""
TOTAL_WAIT=0

if pgrep -x "obsidian" >/dev/null 2>&1 || pidof obsidian >/dev/null 2>&1; then
    log "Obsidian is already running. Proceeding with sync..."
    STARTED_BY_SCRIPT=0
else
    log "Obsidian not running. Starting headlessly..."
    STARTED_BY_SCRIPT=1

    # Start Obsidian headlessly
    xvfb-run -a --server-args='-screen 0 1920x1080x24' "$OBSIDIAN_BIN" --disable-gpu >/dev/null 2>&1 &
    OBS_PID=$!

    log "Started Obsidian with PID $OBS_PID. Waiting ${INIT_WAIT_SECONDS}s for initialization..."
    sleep "$INIT_WAIT_SECONDS"

    # Verify process is still alive
    if ! kill -0 "$OBS_PID" 2>/dev/null; then
        log "ERROR: Obsidian process died during initialization"
        exit 1
    fi
    log "Obsidian initialized successfully"
fi

# Sync vault content to target directory
log "Syncing content from vault to project..."
log "  Source: $SOURCE_VAULT"
log "  Target: $TARGET_DIR/content"

if ! rsync -a --delete \
    --exclude='.git' \
    --exclude='.obsidian' \
    --stats \
    --partial \
    --human-readable \
    --links \
    --perms \
    --times \
    "$SOURCE_VAULT/" "$TARGET_DIR/content/"; then
    log "ERROR: rsync failed"
    exit 1
fi

log "Sync complete"

# Check for git changes
cd "$TARGET_DIR"

if [[ -z "$(git status --porcelain)" ]]; then
    log "No changes to publish"
else
    log "Changes detected. Committing and pushing..."

    git add -A

    if ! git commit -m "Publish update from Obsidian vault (manual)

Manual sync at $(date -Iseconds)

🤖 Generated with obsidian_manual_sync.sh"; then
        log "ERROR: Git commit failed"
        exit 1
    fi

    # Determine branch and push
    branch="$(git rev-parse --abbrev-ref HEAD)"
    log "Pushing to branch: $branch"

    if git rev-parse --abbrev-ref --symbolic-full-name @{u} >/dev/null 2>&1; then
        # Upstream exists
        if ! git push; then
            log "ERROR: Git push failed"
            exit 1
        fi
    else
        # No upstream, push to origin
        if ! git push origin "$branch"; then
            log "ERROR: Git push to origin failed"
            exit 1
        fi
    fi

    log "Successfully pushed changes"
fi

# Shutdown Obsidian if we started it
if [[ "$STARTED_BY_SCRIPT" -eq 1 && -n "$OBS_PID" ]]; then
    log "Shutting down Obsidian (PID $OBS_PID)..."

    if kill "$OBS_PID" 2>/dev/null; then
        # Wait up to 5 seconds for graceful shutdown
        for i in {1..5}; do
            if ! kill -0 "$OBS_PID" 2>/dev/null; then
                log "Obsidian shut down gracefully"
                break
            fi
            sleep 1
        done

        # Force kill if still alive
        if kill -0 "$OBS_PID" 2>/dev/null; then
            log "Force killing Obsidian..."
            kill -9 "$OBS_PID" 2>/dev/null || true
        fi
    fi
fi

log "=== Manual sync completed successfully ==="
exit 0
