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

**Best practice: File watcher (instant) + 6-hourly backup**

1. Start file watcher: `./scripts/obsidian_manage.sh` → option 4
2. Enable 6-hourly cron: `./scripts/obsidian_manage.sh` → option 2

This gives you:

- ⚡ Sync on file changes (120s debounce; 60s for `publish: true`)
- 🛡️ 6-hourly backup sync (safety net)

## Scripts

| Script                      | Purpose                                                      |
| --------------------------- | ------------------------------------------------------------ |
| **obsidian_manage.sh**      | Interactive management tool (⭐ start here)                  |
| **obsidian_watch.sh**       | File watcher with adaptive debouncing (auto-sync on changes) |
| **obsidian_manual_sync.sh** | One-time manual sync                                         |
| **obsidian_cron.sh**        | 6-hourly backup sync (managed by obsidian_manage.sh)         |
| **obsidian_sync_common.sh** | Shared functions (don't run directly)                        |

## Using the Manager

### Interactive Menu

```bash
./scripts/obsidian_manage.sh
```

Options:

1. **Check status** - View watcher, cron, Obsidian status
2. **Enable cron** - 6-hourly backup sync
3. **Disable cron** - Stop 6-hourly backup
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

### Vault Paths

- Obsidian Sync root: `$HOME/obsidian-vault`
- Published content source: `$HOME/obsidian-vault/dev.jujin.kim-publish` (legacy vault directory name; production site is `blog.jujin.kim`)

Set `OBSIDIAN_SYNC_ROOT` to use another configured Obsidian vault:

```bash
OBSIDIAN_SYNC_ROOT="$HOME/my-obsidian-vault" ./scripts/obsidian_manual_sync.sh
```

### Cron Schedule

Default: Every 6 hours (`0 */6 * * *`) - backup only

Change in `obsidian_manage.sh:23`:

```bash
CRON_SCHEDULE="0 */6 * * *"
```

### File Watcher Debounce

Default: 120 seconds. Files with `publish: true` use 60 seconds.

Change in `obsidian_watch.sh:27`:

```bash
DEBOUNCE_PUBLISH=60
```

### Translation Model

Translations call Antigravity in non-interactive plan mode. Leave `AGY_MODEL` unset to use Antigravity's configured default, or choose a model for one run:

```bash
AGY_MODEL=gpt-oss-120b-medium ./scripts/translate_post.sh content/post.md en
```

## How It Works

### File Watcher Mode (Recommended)

1. **Monitor** - inotifywait watches vault for file changes
2. **Debounce** - Wait 120s after last change (60s for `publish: true`)
3. **Trigger** - Calls manual sync script
4. **Sync** - Same process as manual sync below

### Manual/Cron Sync Process

1. **Lock check** - Prevents concurrent runs
2. **Obsidian Sync** - `cd ~/obsidian-vault && ob sync` pulls remote changes
3. **Publish filter** - `rsync --delete` copies vault content, then removes Markdown without `publish: true`
4. **Translation** - Antigravity generates missing or stale translations for published posts
5. **Git push** - One commit and push for `content/` and `.translation_cache` only

If another Obsidian Sync run owns its short-lived vault lease, scripts wait five seconds and retry up to three times. Empty inactive leases are removed because the `ob` CLI can fail to reclaim them on filesystems with sub-millisecond timestamp rounding. Configure retries with `OBSIDIAN_SYNC_LOCK_RETRIES` and `OBSIDIAN_SYNC_LOCK_RETRY_DELAY`.

## Requirements

```bash
# Check dependencies
command -v inotifywait  # File system monitoring (for watcher)
command -v git          # Version control
command -v rsync        # File sync
command -v ob           # Obsidian Sync CLI
command -v agy          # Antigravity CLI for translations
```

Install missing:

```bash
# Ubuntu/Debian
sudo apt install inotify-tools rsync git
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

### Obsidian Sync is not configured

```bash
ob sync-list-local
ob sync-setup --path "$HOME/obsidian-vault"
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

Uncommitted changes outside `content/` and `.translation_cache` block automated publishing. Commit or stash code changes first.

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
Description=Run Obsidian Publish Sync every 6 hours

[Timer]
OnBootSec=5min
OnUnitActiveSec=6h

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
# For timer (6-hourly backup)
systemctl --user daemon-reload
systemctl --user enable --now obsidian-publish.timer
systemctl --user status obsidian-publish.timer

# For watcher (auto-sync on changes)
systemctl --user daemon-reload
systemctl --user enable --now obsidian-watcher.service
systemctl --user status obsidian-watcher.service
```
