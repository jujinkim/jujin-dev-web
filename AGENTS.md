# dev.jujin.kim - Development Blog

Personal development blog powered by Quartz v4, deployed to GitHub Pages at https://dev.jujin.kim

## Technology Stack

- **Static Site Generator**: Quartz v4 (TypeScript-based)
- **Node.js**: v22+ required
- **Package Manager**: npm
- **Deployment**: GitHub Actions → GitHub Pages
- **Comments**: Giscus (GitHub Discussions)
- **Content Source**: Obsidian vault (`~/obsidian-vault/dev.jujin.kim-publish`)
- **Analytics**: Google Analytics (G-X1L31BZG4V)

## Project Structure

```
jujin-dev-web/
├── content/                    # Markdown content (synced from Obsidian)
├── components/custom/          # Custom Quartz components
├── quartz/                     # Quartz core files
├── quartz.config.ts            # Site metadata, theme, plugins
├── quartz.layout.ts            # Page layouts, components
├── scripts/                    # Automation scripts
│   ├── obsidian_*.sh          # Obsidian sync automation
│   └── translate_post.sh      # Multilingual translation
└── .github/workflows/          # CI/CD workflows
```

## Essential Commands

```bash
# Development
npm install                     # Install dependencies
npx quartz build --serve        # Local dev server (http://localhost:8080)
npx quartz build                # Production build

# Content Management
./scripts/obsidian_manual_sync.sh   # Sync from Obsidian vault
./scripts/translate_post.sh <file> ko ja  # Translate to Korean, Japanese
```

## Content Management

**Single Source of Truth**: Obsidian vault at `~/obsidian-vault/dev.jujin.kim-publish`

- Never edit `content/` directly in this repository
- Write/edit content in Obsidian
- Run sync script to bring changes into repo
- Sync script handles: lock file, validation, rsync, git pull --rebase, commit, push

**Sync Automation**:
- `obsidian_manual_sync.sh`: Manual sync with git pull --rebase
- `obsidian_watch.sh`: Auto-sync on vault changes (60s debounce, requires inotifywait)
- `obsidian_cron.sh`: Cron-based sync (every 6 hours)
- `obsidian_manage.sh`: Interactive management CLI

## Multilingual Support

**File Naming Convention**: `post.md` (original), `post.ko.md`, `post.ja.md` (translations)

**Frontmatter Structure**:
```yaml
---
title: Post Title
lang: en
translations:
  ko: post.ko
  ja: post.ja
---
```

**Features**:
- Language switcher UI component (한국어, English, 日本語)
- hreflang SEO tags (x-default points to original language)
- Automatic translation via Gemini CLI
- Bidirectional translation links auto-maintained

**Translation Workflow**:
```bash
# Add lang field to source file
# Then run translation script
./scripts/translate_post.sh content/post.md ko ja

# Script automatically:
# - Translates content via Gemini CLI
# - Creates translation files with proper frontmatter
# - Updates all files with bidirectional translation links
# - Prevents duplicate entries
```

## Custom Components Pattern

To extend Quartz without modifying core files, create components in `components/custom/`:

```
components/custom/
├── ComponentName.tsx           # React component (server-side)
├── ComponentName.inline.ts     # Client-side JavaScript
└── ComponentName.scss          # Styles
```

**Component Template**:
```typescript
// ComponentName.tsx
import { QuartzComponent, QuartzComponentConstructor } from "../../quartz/components/types"
import style from "./ComponentName.scss"
import script from "./ComponentName.inline"

export default (() => {
  const ComponentName: QuartzComponent = (props) => {
    return <div>Your component</div>
  }

  ComponentName.css = style
  ComponentName.afterDOMLoaded = script
  return ComponentName
}) satisfies QuartzComponentConstructor
```

**Usage in `quartz.layout.ts`**:
```typescript
import ComponentName from "./components/custom/ComponentName"

export const defaultContentPageLayout: PageLayout = {
  left: [ComponentName(), Component.PageTitle(), ...],
}
```

**Examples**: `ExplorerWithCounts`, `CustomFooter`, `LanguageSwitcher`, `HeadWithHreflang`

## Configuration

### quartz.config.ts
- Site title, base URL, locale
- Google Analytics integration
- Theme colors (light/dark mode)
- Typography (Noto Sans KR, JetBrains Mono)
- Plugin stack

### quartz.layout.ts
- Page components (search, explorer, graph, TOC, backlinks)
- Giscus comments (repo: jujinkim/jujin-dev-web, lang: ko)
- Custom components integration

## Agent Roles

### Codex / Claude Code
**Role**: Development & Maintenance

- Full repository access with file read/write/edit
- Command execution (bash, npm, git)
- Code development (TypeScript, configs, scripts)
- Build and deployment operations
- Git commit/push with proper messages

**Focus Areas**:
- Quartz configuration and customization
- Custom component development
- Automation scripts (Obsidian sync, translation)
- Build and deployment fixes
- Testing and validation

### Gemini
**Role**: Content Creation Only

- Write Markdown articles via `scripts/vault_io.sh`
- Must include `publish: "true"` in frontmatter
- Must NOT modify code, configs, or scripts
- Run `./scripts/obsidian_manual_sync.sh` after writing
- See `GEMINI.md` for detailed instructions

## Key Notes

- Obsidian vault is the single source of truth for content
- Respect lock file at `scripts/obsidian_publish.lock`
- Run `npm run check` for TypeScript + Prettier validation
- GitHub Actions auto-deploys on push to main
- Node.js v22+ required for Quartz v4.5.2+
- Custom components allow Quartz extension without core modifications
- All multilingual content uses bidirectional translation links
