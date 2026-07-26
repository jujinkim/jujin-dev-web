# dev.jujin.kim

Personal development blog powered by [Quartz v4](https://quartz.jzhao.xyz/).

## 🌐 Site

- **URL**: https://dev.jujin.kim
- **Content**: Development notes and articles
- **Comments**: Powered by Giscus

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Sync content from Obsidian
./scripts/obsidian_manual_sync.sh

# Build and serve locally
npx quartz build --serve
```

## 📝 Content Management

Content is managed in Obsidian and synced to this repository:

- Obsidian Sync root: `~/obsidian-vault`
- Published content: `~/obsidian-vault/dev.jujin.kim-publish`
- Run `./scripts/obsidian_manual_sync.sh` to pull with `ob`, then sync content

## 🛠️ Tech Stack

- **Generator**: Quartz v4
- **Node.js**: v22+
- **Deployment**: GitHub Pages
- **Comments**: Giscus (GitHub Discussions)

## 📚 Documentation

See [CLAUDE.md](./CLAUDE.md) for detailed documentation.

## 📄 License

Content: All rights reserved
Quartz: MIT License (see [LICENSE.txt](./LICENSE.txt))
