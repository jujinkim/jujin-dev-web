# Gemini Project Context: jujin.dev

This document provides context for the Gemini AI assistant to understand and effectively work with the `jujin.dev` project.

## Gemini's Role: Content Creation

**Gemini's primary role in this project is to write articles for the blog.**

- **DO NOT EDIT CODE**: Gemini should not modify any project files, including configurations, scripts, or themes.
- **WRITE ARTICLES**: Gemini's main task is to generate high-quality articles in Markdown format.
- **OUTPUT DIRECTORY**: All articles should be written to the Obsidian vault located at `~/Obsidian Vault/jujin.dev-publish`.
- **DOCUMENT PROPERTIES**: When creating a new article, you must include the following frontmatter property:
  ```yaml
  publish: "true"
  ```
- **SYNC AFTER WRITING**: After successfully writing an article, run the manual sync script to bring the content into the project:
  ```bash
  ./scripts/obsidian_manual_sync.sh
  ```

## Project Overview

`jujin.dev` is a personal development blog built with [Quartz v4](https://quartz.jzhao.xyz/), a static site generator designed for creating digital gardens and wikis from Markdown files. The content is written and managed in an Obsidian vault and then synced to this repository for building and deployment.

- **Site URL**: https://dev.jujin.kim
- **Source Code**: https://github.com/jujinkim/jujin-dev-web
- **Primary Language**: TypeScript
- **Framework**: Quartz v4
- **Package Manager**: npm

## Building and Running

The project uses `npm` for dependency management and `npx quartz` for building and serving the site.

### Key Commands

- **Install Dependencies**:
  ```bash
  npm install
  ```

- **Local Development**:
  ```bash
  npx quartz build --serve
  ```
  This command builds the site and starts a local server at `http://localhost:8080` with hot-reloading.

- **Build for Production**:
  ```bash
  npx quartz build
  ```
  This command generates the static site in the `public` directory.

- **Content Synchronization**:
  The content for the blog is stored in a separate Obsidian vault and synced into the `content` directory of this project. The sync is performed by the `scripts/obsidian_sync_common.sh` script. To run a sync, use one of the wrapper scripts:
  ```bash
  ./scripts/obsidian_manual_sync.sh
  ```

## Development Conventions

### Code Style

The project uses [Prettier](https://prettier.io/) for code formatting. To format the code, run:

```bash
npx prettier . --write
```

### Linting and Type-Checking

The project uses TypeScript for type safety. To check for type errors, run:

```bash
tsc --noEmit
```

### Testing

The project has a test suite that can be run with:

```bash
npm test
```

### Contribution

As this is a personal project, contributions are not expected. However, the development workflow is as follows:

1.  Create a new branch for the feature or bug fix.
2.  Make changes to the code.
3.  Ensure all checks (linting, testing, building) pass.
4.  Create a pull request.

## Project Structure

- `content/`: Markdown files that constitute the blog's content.
- `quartz/`: The core Quartz v4 framework files.
- `quartz.config.ts`: The main configuration file for the Quartz site, including site metadata, theme, and plugins.
- `quartz.layout.ts`: Defines the layout and components of the site.
- `package.json`: Lists project dependencies and scripts.
- `scripts/`: Contains scripts for content synchronization and other management tasks.
- `.github/workflows/`: GitHub Actions workflows for CI/CD.