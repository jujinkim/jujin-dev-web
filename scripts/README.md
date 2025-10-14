# Obsidian → Git Publish Automation Scripts

Automated workflow for syncing Obsidian vault content to this repository and publishing to GitHub Pages.

## 📁 Scripts

- **`obsidian_auto_sync.sh`** - Automated sync (for cron/systemd timer)
- **`obsidian_manual_sync.sh`** - Manual sync with customizable wait time

## 🚀 Quick Start

### 1. Make scripts executable

```bash
chmod +x scripts/obsidian_auto_sync.sh
chmod +x scripts/obsidian_manual_sync.sh
```

### 2. Test manually

```bash
# From project root
./scripts/obsidian_manual_sync.sh
```

### 3. Set up automation (cron)

```bash
crontab -e
```

Add this line:
```cron
*/5 * * * * /home/jujin/workspace/projects/jujin-dev-web/scripts/obsidian_auto_sync.sh >> /home/jujin/workspace/projects/jujin-dev-web/.obsidian_publish.log 2>&1
```

## 📖 Usage

### Manual Sync

```bash
# Default: 5 minute wait after initialization
./scripts/obsidian_manual_sync.sh

# Custom wait time (2 minutes)
./scripts/obsidian_manual_sync.sh "$HOME/Obsidian Vault/jujin.dev-publish" 120

# No additional wait (just 30s initialization)
./scripts/obsidian_manual_sync.sh "$HOME/Obsidian Vault/jujin.dev-publish" 0
```

## ⚙️ Configuration

### Source Vault
Default: `$HOME/Obsidian Vault/jujin.dev-publish`

### Wait Times
- **INIT_WAIT_SECONDS**: 30s - Wait after starting Obsidian
- **EXISTING_WAIT_SECONDS**: 30s - Grace period if Obsidian already running
- **DEFAULT_WAIT_SECONDS**: 300s - Additional wait for vault sync (manual script only)

### Lock File
`scripts/obsidian_publish.lock` - Prevents concurrent script execution

### Log File
`.obsidian_publish.log` - Located in project root

## 🔧 Systemd Timer (Alternative to Cron)

Create `~/.config/systemd/user/obsidian-publish.service`:

```ini
[Unit]
Description=Obsidian Publish Sync

[Service]
Type=oneshot
WorkingDirectory=/home/jujin/workspace/projects/jujin-dev-web
ExecStart=/home/jujin/workspace/projects/jujin-dev-web/scripts/obsidian_auto_sync.sh
```

Create `~/.config/systemd/user/obsidian-publish.timer`:

```ini
[Unit]
Description=Run Obsidian Publish Sync every 5 minutes

[Timer]
OnBootSec=2min
OnUnitActiveSec=5min

[Install]
WantedBy=timers.target
```

Enable and start:
```bash
systemctl --user daemon-reload
systemctl --user enable --now obsidian-publish.timer
systemctl --user status obsidian-publish.timer
```

## ⚠️ Important Warnings

### rsync --delete
Scripts use `rsync --delete` which **removes files in target that don't exist in source**. The Obsidian vault is the source of truth.

### Git Conflicts
Don't edit content files directly in this repository. All changes should be made in the Obsidian vault.

### File Locking
Only one script instance can run at a time. If stuck, remove: `scripts/obsidian_publish.lock`

### Paths with Spaces
Scripts handle spaces in vault paths. Don't modify quoting logic!

## 🔍 How It Works

1. **Lock Acquisition**: Prevents concurrent runs
2. **Obsidian Detection**: Checks if Obsidian is running
3. **Start if Needed**: Launches Obsidian headlessly with Xvfb
4. **Wait for Init**: 30s initialization wait
5. **Sync Content**: rsync vault → `content/` directory
6. **Git Operations**: Commit and push if changes detected
7. **Cleanup**: Shutdown Obsidian if script started it

## 🐛 Troubleshooting

### Script won't run
- Check executable permissions: `chmod +x scripts/*.sh`
- Verify Obsidian installed: `which obsidian`
- Check dependencies: `xvfb-run`, `git`, `rsync`

### Lock file issues
```bash
rm scripts/obsidian_publish.lock
```

### Obsidian won't start
```bash
# Test Xvfb
xvfb-run --auto-servernum echo "test"

# Try starting Obsidian manually
obsidian
```

### Git push fails
```bash
# Check remote
git remote -v

# Test SSH
ssh -T git@github.com

# Verify GitHub Pages configured
```

### No changes detected
- Verify vault path is correct
- Check vault contains files
- Review rsync output in logs

### View logs
```bash
tail -f .obsidian_publish.log
```

## 📊 Log Management

### Keep last 1000 lines
```bash
tail -n 1000 .obsidian_publish.log > .obsidian_publish.log.tmp
mv .obsidian_publish.log.tmp .obsidian_publish.log
```

### Logrotate (optional)
Create `/etc/logrotate.d/obsidian-publish`:

```
/home/jujin/workspace/projects/jujin-dev-web/.obsidian_publish.log {
    size 10M
    rotate 5
    compress
    missingok
    notifempty
}
```

## 📝 Notes

- Scripts auto-detect project directory from their location
- All timestamps are ISO-8601 format
- Graceful shutdown with 5s timeout before force kill
- Only PIDs started by script are killed
