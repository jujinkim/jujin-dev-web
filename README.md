# blog.jujin.kim

Quartz 5 source for [blog.jujin.kim](https://blog.jujin.kim).

Production serves only content with `publish: true`; `draft: true` remains excluded. The
previous Quartz 4 production state is retained on `legacy/quartz4` for rollback. This site
does not redirect `dev.jujin.kim` or `jujin.dev`.

## Local validation

```bash
npm ci
npm run install-plugins
npm run check
npm test
npx quartz build
```

Local Quartz plugins live under `plugins/*`. Build them before rebuilding Quartz so
`.quartz/plugins/index.ts` sees their generated declarations.

## Obsidian publishing

Run scripts from this repository. They run `ob sync` from `/home/jujin/obsidian-vault`, copy
only `publish: true` notes, generate missing translations with `agy`, then commit only
`content/` and `.translation_cache`.

`/home/jujin/obsidian-vault/dev.jujin.kim-publish` remains legacy vault directory name; it is
content source, not production domain. See [scripts/README.md](scripts/README.md).
