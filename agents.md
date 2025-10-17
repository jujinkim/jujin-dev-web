# Agents Playbook

## Project Snapshot
- Static site powered by Quartz v4 (`quartz/`, `quartz.config.ts`, `quartz.layout.ts`) and deployed to GitHub Pages at `https://dev.jujin.kim`.
- Markdown content lives in `content/` and is sourced from the Obsidian vault `~/Obsidian Vault/dev.jujin.kim-publish`.
- Package management uses npm with Node.js ≥ 22 (`npm install`, `npx quartz build`, `npx quartz build --serve`).
- Comments are handled via Giscus (see `quartz.layout.ts`), analytics via Plausible (`quartz.config.ts`).
- Obsidian sync automation lives in `scripts/` with shared logic in `obsidian_sync_common.sh`.

## Shared Workflow Notes
- Use the sync scripts to move vault content into the repo. `obsidian_manual_sync.sh` now performs `git pull --rebase` before pushing.
- `obsidian_manage.sh` offers an interactive menu to control cron and watcher automation; cron fallback runs every 6 hours via `obsidian_cron.sh`.
- `obsidian_watch.sh` listens for vault changes (requires `inotifywait`) and triggers manual sync after a 60 s debounce.
- Treat the Obsidian vault as the single source of truth for Markdown content; do not edit `content/` directly in this repo.
- Always respect the lock file at `scripts/obsidian_publish.lock`; the helpers acquire it automatically to avoid double runs.
- When contributing code, run `npm run check` (TypeScript + Prettier) or `npx quartz build` to validate.

## Agent Roles

### Codex (ChatGPT GPT-5)
- Acts as the coding agent inside the Codex CLI with full repo access; may edit configs, scripts, and TypeScript.
- Preferred tools: `rg` for search, `apply_patch` for edits, `npx quartz ...` for builds if needed.
- Should maintain sync automation (e.g., manual rebase push) and highlight verification steps after edits.

### Claude
- Serves as the detailed project explainer; refer to `CLAUDE.md` for in-depth architecture, setup, and workflow docs.
- Suitable for onboarding summaries, walkthroughs of Quartz configuration, and guidance on deployment or content management.
- Should not run commands but can outline instructions for humans or other agents.

### Gemini
- Dedicated content-writing agent; instructions in `GEMINI.md`.
- Only writes Markdown articles with `publish: "true"` frontmatter via `scripts/vault_io.sh`.
- Must not modify code or configs; should run `./scripts/obsidian_manual_sync.sh` after writing to sync new articles.

## Key Files & Directories
- `quartz.config.ts`: Site metadata, theme colors, plugin stack.
- `quartz.layout.ts`: Page layouts, component composition, Giscus configuration.
- `scripts/obsidian_sync_common.sh`: Core sync pipeline (locking, validation, rsync, git commit/pull --rebase/push).
- `scripts/obsidian_manage.sh`: Interactive cron/watch management CLI.
- `content/index.md`: Landing page template showing current site tone and Markdown conventions.
