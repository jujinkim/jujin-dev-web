# Obsidian Sync Automation

Automatically sync Obsidian vault to GitHub Pages with smart file watching.

## Quick Start

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Install dependencies
sudo apt install inotify-tools

# Run management tool
./scripts/obsidian_manage.sh
```

## Recommended Setup

**Best practice: File watcher (instant) + hourly backup**

1. Start file watcher: `./scripts/obsidian_manage.sh` → option 4
2. Enable hourly cron: `./scripts/obsidian_manage.sh` → option 2

This gives you:
- ⚡ Instant sync on file changes (60s debounce)
- 🛡️ Hourly backup sync (safety net)

## Scripts

| Script | Purpose |
|--------|---------|
| **obsidian_manage.sh** | Interactive management tool (⭐ start here) |
| **obsidian_watch.sh** | File watcher with 60s debouncing (auto-sync on changes) |
| **obsidian_manual_sync.sh** | One-time manual sync |
| **obsidian_cron.sh** | Hourly backup sync (managed by obsidian_manage.sh) |
| **obsidian_sync_common.sh** | Shared functions (don't run directly) |

## Using the Manager

### Interactive Menu

```bash
./scripts/obsidian_manage.sh
```

Options:
1. **Check status** - View watcher, cron, Obsidian status
2. **Enable cron** - Hourly backup sync
3. **Disable cron** - Stop hourly backup
4. **Start watcher** - Auto-sync on file changes (60s debounce)
5. **Stop watcher** - Stop file watcher
6. **Run manual sync** - Sync once now
7. **View sync logs** - Monitor sync activity
8. **View watcher logs** - Monitor file change detection
9. **Clear lock file** - Fix stuck processes

### Command Line

```bash
./scripts/obsidian_manage.sh status    # Check status
./scripts/obsidian_manage.sh enable    # Enable automation
./scripts/obsidian_manage.sh disable   # Disable automation
./scripts/obsidian_manage.sh sync      # Run manual sync
./scripts/obsidian_manage.sh logs      # View logs
```

## Manual Sync Only

```bash
# Use default vault path
./scripts/obsidian_manual_sync.sh

# Custom vault path
./scripts/obsidian_manual_sync.sh "$HOME/My Vault/publish"
```

## Configuration

### Default Vault Path
`$HOME/Obsidian Vault/jujin.dev-publish`

Change in `obsidian_sync_common.sh:12`:
```bash
DEFAULT_SOURCE_VAULT="$HOME/Obsidian Vault/jujin.dev-publish"
```

### Cron Schedule
Default: Every hour (`0 * * * *`) - backup only

Change in `obsidian_manage.sh:23`:
```bash
CRON_SCHEDULE="0 * * * *"
```

### File Watcher Debounce
Default: 60 seconds (wait after last change)

Change in `obsidian_watch.sh:27`:
```bash
DEBOUNCE_SECONDS=60
```

### Obsidian Startup Wait
Default: 30 seconds (when starting Obsidian)

Change in `obsidian_sync_common.sh:13`:
```bash
INIT_WAIT_SECONDS=30
```

## How It Works

### File Watcher Mode (Recommended)
1. **Monitor** - inotifywait watches vault for file changes
2. **Debounce** - Wait 60s after last change (resets on new changes)
3. **Trigger** - Calls manual sync script
4. **Sync** - Same process as manual sync below

### Manual/Cron Sync Process
1. **Lock check** - Prevents concurrent runs
2. **Start Obsidian** - Launches headlessly if needed (Xvfb)
3. **Wait** - 30s initialization (only if script started Obsidian)
4. **Sync** - `rsync --delete` from vault → `content/`
5. **Git push** - Commit and push if changes exist
6. **Cleanup** - Shutdown Obsidian if script started it

## Requirements

```bash
# Check dependencies
command -v inotifywait  # File system monitoring (for watcher)
command -v xvfb-run     # Virtual display for headless Obsidian
command -v git          # Version control
command -v rsync        # File sync
command -v obsidian     # Obsidian app
```

Install missing:
```bash
# Ubuntu/Debian
sudo apt install inotify-tools xvfb rsync git
```

## Troubleshooting

### Script won't run
```bash
chmod +x scripts/*.sh
```

### Lock file stuck
```bash
rm scripts/obsidian_publish.lock
# Or use: ./scripts/obsidian_manage.sh → option 6
```

### View logs
```bash
tail -f .obsidian_publish.log
```

### Obsidian won't start
```bash
# Test Xvfb
xvfb-run --auto-servernum echo "test"

# Check Obsidian path
which obsidian
```

### Git push fails
```bash
git remote -v              # Check remote
ssh -T git@github.com      # Test SSH
```

### Check cron jobs
```bash
crontab -l                 # List all jobs
crontab -e                 # Edit jobs
```

## Warning

**Uses `rsync --delete`** - Files in `content/` not in vault will be deleted!

The Obsidian vault is the source of truth. Don't edit content files directly in this repository.

## Files

- **Lock**: `scripts/obsidian_publish.lock`
- **Sync log**: `.obsidian_publish.log` (project root)
- **Watcher log**: `.obsidian_watch.log` (project root)
- **Cron**: Managed by `crontab -e`

## Advanced: systemd Timer

Alternative to cron (optional):

`~/.config/systemd/user/obsidian-publish.service`:
```ini
[Unit]
Description=Obsidian Publish Sync

[Service]
Type=oneshot
WorkingDirectory=/home/jujin/workspace/projects/jujin-dev-web
ExecStart=/home/jujin/workspace/projects/jujin-dev-web/scripts/obsidian_cron.sh
```

`~/.config/systemd/user/obsidian-publish.timer`:
```ini
[Unit]
Description=Run Obsidian Publish Sync every hour

[Timer]
OnBootSec=5min
OnUnitActiveSec=1h

[Install]
WantedBy=timers.target
```

For file watcher as systemd service:

`~/.config/systemd/user/obsidian-watcher.service`:
```ini
[Unit]
Description=Obsidian File Watcher
After=network.target

[Service]
Type=simple
WorkingDirectory=/home/jujin/workspace/projects/jujin-dev-web
ExecStart=/home/jujin/workspace/projects/jujin-dev-web/scripts/obsidian_watch.sh
Restart=always
RestartSec=10

[Install]
WantedBy=default.target
```

Enable:
```bash
systemctl --user daemon-reload
systemctl --user enable --now obsidian-publish.timer
systemctl --user status obsidian-publish.timer
```
