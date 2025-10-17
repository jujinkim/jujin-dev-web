# dev.jujin.kim - Development Blog

This is a personal development blog powered by Quartz static site generator, deployed on GitHub Pages with Giscus comments integration.

## Project Overview

- **Site URL**: https://dev.jujin.kim
- **Generator**: [Quartz v4](https://quartz.jzhao.xyz/)
- **Deployment**: GitHub Pages
- **Comments**: Giscus
- **Content Source**: Obsidian vault (`~/obsidian-vault/dev.jujin.kim-publish`)

## Technology Stack

- **Static Site Generator**: Quartz 4 (TypeScript-based)
- **Node.js**: v22.x (required by Quartz)
- **Package Manager**: npm
- **CI/CD**: GitHub Actions
- **Comments System**: Giscus (GitHub Discussions)

## Project Structure

```
jujin-dev-web/
├── content/              # Markdown content (synced from Obsidian)
├── quartz/               # Quartz core files
├── quartz.config.ts      # Main configuration file
├── quartz.layout.ts      # Layout configuration
├── public/               # Built static files (generated)
├── .github/workflows/    # GitHub Actions workflows
│   └── deploy.yaml       # Deployment workflow
├── sync-content.sh       # Content sync script
└── CLAUDE.md            # This file
```

## Configuration Files

### quartz.config.ts
Main configuration file containing:
- Site title: "dev.jujin.kim"
- Base URL: "dev.jujin.kim"
- Locale: Korean (ko-KR)
- Theme settings (light/dark mode)
- Plugins configuration

### quartz.layout.ts
Layout configuration with:
- Page components (title, search, explorer, graph, etc.)
- Giscus comments integration
- Footer with GitHub link

## Setup Instructions

### Prerequisites
- Node.js v22 or higher
- npm
- Git
- rsync (for content syncing)

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone git@github.com:jujinkim/jujin-dev-web.git
   cd jujin-dev-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Obsidian vault path**
   Edit `sync-content.sh` and update `OBSIDIAN_VAULT_PATH` to point to your Obsidian publish directory:
   ```bash
   OBSIDIAN_VAULT_PATH="$HOME/obsidian-vault/dev.jujin.kim-publish"
   ```

4. **Set up Giscus**
   - Go to https://github.com/jujinkim/jujin-dev-web/settings
   - Enable GitHub Discussions
   - Visit https://giscus.app to get your configuration
   - Update `quartz.layout.ts` with your `repoId` and `categoryId`

5. **Configure GitHub Pages**
   - Go to repository Settings > Pages
   - Set Source to "GitHub Actions"
   - Ensure custom domain is set to `dev.jujin.kim` (if using custom domain)

## Development Workflow

### Local Development

1. **Sync content from Obsidian**
   ```bash
   ./sync-content.sh
   ```

2. **Build and serve locally**
   ```bash
   npx quartz build --serve
   ```
   Site will be available at http://localhost:8080

### Publishing Content

1. **Sync content from Obsidian vault**
   ```bash
   ./sync-content.sh
   ```

2. **Commit and push changes**
   ```bash
   git add content/
   git commit -m "Update content"
   git push
   ```

3. **GitHub Actions will automatically:**
   - Build the site using Quartz
   - Deploy to GitHub Pages
   - Site will be live at https://dev.jujin.kim

## Available Commands

```bash
# Install dependencies
npm install

# Build the site
npx quartz build

# Build and serve locally
npx quartz build --serve

# Sync content from Obsidian
./sync-content.sh

# Update Quartz (when new version is available)
npm update @jackyzha0/quartz
```

## Giscus Configuration

The Giscus comment system is configured in `quartz.layout.ts`:
- **Provider**: giscus
- **Repository**: jujinkim/jujin-dev-web
- **Mapping**: pathname (uses URL path for comment threads)
- **Language**: Korean (ko)
- **Position**: bottom

**TODO**: Update `repoId` and `categoryId` in `quartz.layout.ts` after setting up GitHub Discussions.

## Content Management

### Obsidian Vault Structure
Content is managed in an Obsidian vault at:
```
~/obsidian-vault/dev.jujin.kim-publish/
```

> Single source of truth: All Markdown content should be authored and updated inside the Obsidian vault. Do not edit files under `content/` directly within this repository; instead, sync changes from the vault using the provided scripts.

### Syncing Process
1. Write/edit content in Obsidian
2. Move files to the publish directory (`dev.jujin.kim-publish`)
3. Run `./sync-content.sh` to sync to Quartz
4. Commit and push changes

### Ignored Patterns
The following patterns are excluded from the site:
- `.obsidian/` - Obsidian configuration
- `private/` - Private notes
- `templates/` - Note templates

## Deployment

### GitHub Actions Workflow

The site is automatically deployed when changes are pushed to the `main` branch.

Workflow steps:
1. Checkout code with full git history
2. Set up Node.js v22
3. Install dependencies
4. Build site with Quartz
5. Upload artifact to GitHub Pages
6. Deploy to GitHub Pages

### Manual Deployment

To trigger a manual deployment:
1. Go to Actions tab in GitHub
2. Select "Deploy Quartz site to GitHub Pages" workflow
3. Click "Run workflow"

## Customization

### Theme Colors
Edit `quartz.config.ts` to customize light/dark mode colors:
```typescript
theme: {
  colors: {
    lightMode: { ... },
    darkMode: { ... }
  }
}
```

### Typography
Customize fonts in `quartz.config.ts`:
```typescript
typography: {
  header: "Schibsted Grotesk",
  body: "Source Sans Pro",
  code: "IBM Plex Mono",
}
```

### Layout Components
Modify `quartz.layout.ts` to add/remove/reorder components:
- Left sidebar: PageTitle, Search, Darkmode, Explorer
- Right sidebar: Graph, TableOfContents, Backlinks
- Content area: Breadcrumbs, ArticleTitle, ContentMeta, TagList

### Custom Layout Components

To modify or extend Quartz layouts **without touching core files**, create custom components in the `components/custom/` directory.

#### File Structure

Custom components follow this three-file pattern:

```
components/custom/
├── ComponentName.tsx          # React component (server-side)
├── ComponentName.inline.ts    # Client-side JavaScript
└── ComponentName.scss         # Styles
```

#### Component Implementation

**1. React Component (`ComponentName.tsx`)**
```typescript
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import style from "./ComponentName.scss"
// @ts-ignore - bundled at build time
import script from "./ComponentName.inline"

export default (() => {
  const ComponentName: QuartzComponent = (props: QuartzComponentProps) => {
    // Server-side rendering logic
    return <div>Your component</div>
  }

  ComponentName.css = style           // Attach styles
  ComponentName.afterDOMLoaded = script  // Attach client-side script

  return ComponentName
}) satisfies QuartzComponentConstructor
```

**2. Client-side Script (`ComponentName.inline.ts`)**
```typescript
// This runs in the browser after DOM loads
document.addEventListener("nav", () => {
  // Your interactive logic
  const elements = document.querySelectorAll(".your-selector")
  // Add event listeners, etc.
})
```

**3. Styles (`ComponentName.scss`)**
```scss
.your-component {
  // Your styles
}
```

#### Using Custom Components

Import and use in `quartz.layout.ts`:
```typescript
import ComponentName from "./components/custom/ComponentName"

export const defaultContentPageLayout: PageLayout = {
  left: [
    ComponentName(),  // Use your custom component
    Component.PageTitle(),
    // ... other components
  ],
  // ...
}
```

#### Example: ExplorerWithCounts

See `components/custom/ExplorerWithCounts.*` for a complete example:
- **ExplorerWithCounts.tsx**: Renders folder structure with page counts
- **ExplorerWithCounts.inline.ts**: Handles folder panel navigation and mobile overlay
- **ExplorerWithCounts.scss**: Styles with desktop/mobile responsive layout

Recent commits (ccc9fb5, 69dabc4, bfdce12, fb94d8d) show mobile explorer toggle refinements.

#### Benefits of This Approach

- ✅ **No Quartz core file modifications** - easier to upgrade
- ✅ **Clean separation** - custom code isolated in dedicated directory
- ✅ **Full TypeScript support** - proper typing with Quartz interfaces
- ✅ **Hot reload** - changes picked up during `npx quartz build --serve`

## Troubleshooting

### Node.js Version Issues
Quartz requires Node.js v22+. Use nvm to manage Node.js versions:
```bash
nvm install 22
nvm use 22
```

### Content Not Updating
1. Ensure Obsidian vault path is correct in `sync-content.sh`
2. Check that rsync is installed
3. Verify files are in the publish directory

### Build Failures
1. Check GitHub Actions logs for errors
2. Ensure all dependencies are installed
3. Test build locally: `npx quartz build`

### Comments Not Showing
1. Verify GitHub Discussions is enabled
2. Check `repoId` and `categoryId` in `quartz.layout.ts`
3. Ensure Giscus app is installed on the repository

## Links

- [Quartz Documentation](https://quartz.jzhao.xyz/)
- [Giscus](https://giscus.app/)
- [GitHub Repository](https://github.com/jujinkim/jujin-dev-web)
- [Live Site](https://dev.jujin.kim)

## Notes for Claude

- This project uses Quartz v4 for static site generation
- Content is managed in an Obsidian vault and synced using rsync
- GitHub Actions handles automated deployment to GitHub Pages
- Giscus integration requires manual setup of GitHub Discussions
- Node.js v22+ is required for Quartz v4.5.2+
