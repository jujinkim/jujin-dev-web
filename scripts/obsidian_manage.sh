#!/bin/bash
################################################################################
# obsidian_manage.sh - Interactive management tool for Obsidian sync automation
#
# USAGE:
#   ./scripts/obsidian_manage.sh
#
# FEATURES:
#   - Check cron scheduler status
#   - Enable/disable cron automation
#   - Run manual sync
#   - View sync logs
################################################################################

set -euo pipefail

# Load common functions
SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPTS_DIR/obsidian_sync_common.sh"

# Cron configuration
CRON_JOB_PATTERN="obsidian_cron.sh"
CRON_SCHEDULE="*/5 * * * *"
CRON_COMMAND="$SCRIPTS_DIR/obsidian_cron.sh >> $PROJECT_DIR/.obsidian_publish.log 2>&1"
LOG_FILE="$PROJECT_DIR/.obsidian_publish.log"

# Colors for output
if [[ -t 1 ]]; then
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    RED='\033[0;31m'
    BLUE='\033[0;34m'
    NC='\033[0m' # No Color
else
    GREEN=''
    YELLOW=''
    RED=''
    BLUE=''
    NC=''
fi

# Check if cron job is installed
check_cron_status() {
    if crontab -l 2>/dev/null | grep -q "$CRON_JOB_PATTERN"; then
        return 0
    else
        return 1
    fi
}

# Display current status
show_status() {
    echo -e "${BLUE}=== Obsidian Sync Status ===${NC}"
    echo ""

    # Cron status
    echo -n "Cron Scheduler: "
    if check_cron_status; then
        echo -e "${GREEN}ENABLED${NC}"
        echo "Schedule: Every 5 minutes"
        echo ""
        echo "Active cron job:"
        crontab -l | grep "$CRON_JOB_PATTERN" | sed 's/^/  /'
    else
        echo -e "${YELLOW}DISABLED${NC}"
    fi
    echo ""

    # Obsidian status
    echo -n "Obsidian: "
    if is_obsidian_running; then
        echo -e "${GREEN}Running${NC}"
    else
        echo -e "${YELLOW}Not running${NC}"
    fi
    echo ""

    # Lock status
    if [[ -f "$LOCKFILE" ]]; then
        echo -e "${YELLOW}⚠ Lock file exists: $LOCKFILE${NC}"
        echo "  (Another sync may be running, or a previous run was interrupted)"
        echo ""
    fi

    # Recent log entries
    if [[ -f "$LOG_FILE" ]]; then
        echo "Recent log entries (last 5 lines):"
        tail -n 5 "$LOG_FILE" | sed 's/^/  /'
        echo ""
        echo "Full log: $LOG_FILE"
    else
        echo -e "${YELLOW}No log file found${NC}"
    fi
    echo ""
}

# Enable cron automation
enable_cron() {
    if check_cron_status; then
        echo -e "${YELLOW}Cron job already enabled${NC}"
        return
    fi

    echo "Adding cron job..."
    (crontab -l 2>/dev/null; echo "$CRON_SCHEDULE $CRON_COMMAND") | crontab -

    if check_cron_status; then
        echo -e "${GREEN}✓ Cron job enabled successfully${NC}"
        echo "Schedule: Every 5 minutes"
        echo "Logs: $LOG_FILE"
    else
        echo -e "${RED}✗ Failed to enable cron job${NC}"
        exit 1
    fi
}

# Disable cron automation
disable_cron() {
    if ! check_cron_status; then
        echo -e "${YELLOW}Cron job already disabled${NC}"
        return
    fi

    echo "Removing cron job..."
    crontab -l 2>/dev/null | grep -v "$CRON_JOB_PATTERN" | crontab -

    if ! check_cron_status; then
        echo -e "${GREEN}✓ Cron job disabled successfully${NC}"
    else
        echo -e "${RED}✗ Failed to disable cron job${NC}"
        exit 1
    fi
}

# Run manual sync
run_manual_sync() {
    echo -e "${BLUE}=== Running Manual Sync ===${NC}"
    echo ""

    "$SCRIPTS_DIR/obsidian_manual_sync.sh" "$@"
}

# View logs
view_logs() {
    if [[ ! -f "$LOG_FILE" ]]; then
        echo -e "${YELLOW}No log file found${NC}"
        return
    fi

    echo -e "${BLUE}=== Viewing Sync Logs ===${NC}"
    echo "Press Ctrl+C to exit"
    echo ""
    sleep 1

    tail -f "$LOG_FILE"
}

# Show menu
show_menu() {
    echo -e "${BLUE}=== Obsidian Sync Manager ===${NC}"
    echo ""
    echo "1) Check status"
    echo "2) Enable cron automation (every 5 minutes)"
    echo "3) Disable cron automation"
    echo "4) Run manual sync now"
    echo "5) View live logs"
    echo "6) Clear lock file"
    echo "0) Exit"
    echo ""
    echo -n "Select option: "
}

# Clear lock file
clear_lock() {
    if [[ -f "$LOCKFILE" ]]; then
        rm -f "$LOCKFILE"
        echo -e "${GREEN}✓ Lock file removed${NC}"
    else
        echo -e "${YELLOW}No lock file found${NC}"
    fi
}

# Main interactive loop
main() {
    # If arguments provided, run non-interactively
    case "${1:-}" in
        status)
            show_status
            exit 0
            ;;
        enable)
            enable_cron
            exit 0
            ;;
        disable)
            disable_cron
            exit 0
            ;;
        sync)
            shift
            run_manual_sync "$@"
            exit 0
            ;;
        logs)
            view_logs
            exit 0
            ;;
        --help|-h)
            echo "Usage: $0 [command]"
            echo ""
            echo "Commands:"
            echo "  status   - Show current status"
            echo "  enable   - Enable cron automation"
            echo "  disable  - Disable cron automation"
            echo "  sync     - Run manual sync"
            echo "  logs     - View live logs"
            echo ""
            echo "Run without arguments for interactive menu"
            exit 0
            ;;
    esac

    # Show initial status
    show_status

    # Interactive menu loop
    while true; do
        show_menu
        read -r choice

        case "$choice" in
            1)
                echo ""
                show_status
                ;;
            2)
                echo ""
                enable_cron
                echo ""
                ;;
            3)
                echo ""
                disable_cron
                echo ""
                ;;
            4)
                echo ""
                run_manual_sync
                echo ""
                ;;
            5)
                echo ""
                view_logs
                echo ""
                ;;
            6)
                echo ""
                clear_lock
                echo ""
                ;;
            0)
                echo "Exiting..."
                exit 0
                ;;
            *)
                echo -e "${RED}Invalid option${NC}"
                echo ""
                ;;
        esac
    done
}

main "$@"
