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
    commit_and_push "$commit_message"

    if [[ $started_by_script -eq 1 && -n "$obs_pid" ]]; then
        shutdown_obsidian "$obs_pid"
    fi
}
