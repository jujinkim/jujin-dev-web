# jujin.dev

A bilingual developer dashboard at **https://jujin.dev/**. The original project showcase lives at **https://jujin.dev/apps/**. Kickoff remains a separate project at https://kickoff.jujin.dev.

## Development

The frontend is plain HTML, CSS, and JavaScript, with no package installation or framework build. Python 3.12+ collects public data and stages the site. Node 22 runs the layout tests.

```sh
python3 -m unittest discover -s tests -p "test_*.py"
node --test tests/*.test.mjs
python3 scripts/build.py
python3 -m http.server 8080 --directory dist
```

Preview `http://localhost:8080/` and `/apps/`. Building requires internet access; the first build must collect all eight quotes and the GeekNews feed successfully. Subsequent builds can preserve validated snapshots from the deployed site. `--previous-base URL` selects the previous deployment; an empty value disables fallback. `dist/` contains only public assets and is ignored by Git.

## Widgets and preferences

The registry in `dashboard.js` defines market, GeekNews, and updates widgets. Add/remove/reorder and standard/wide settings persist in `jujin.dashboard.v1` localStorage with the selected language. Mobile displays one column without losing desktop widths. Drag handles, keyboard movement buttons, and reset are available in Edit layout. Removing all widgets is supported. Storage failures use in-memory settings.

UI language initially follows the browser (Korean for `ko`, English otherwise). Feed content stays in its original language. Dates show Seoul time. The Apps showcase retains its existing English content.

The public JSON contracts use `schemaVersion: 1` and `items`:

- `market.json`: id, symbol, value, change, changePercent, sourceTime, collectedAt, sourceUrl. Quote time and successful collection time are independent; a closed market is not a collection failure.
- `geeknews.json`: collectedAt and items with title, url, publishedAt. Source is the official Atom feed at https://news.hada.io/rss/news. Titles only, linked to GeekNews.
- `updates.json`: items with title, url, publishedAt. Empty until actual news is configured. Future X/Threads adapters can produce this contract; no accounts, tokens, or invented posts are included now.

Market sources: Yahoo Finance chart endpoint with `range=1d`, symbols `^KS11`, `^KQ11`, `^IXIC`, `^GSPC`, `GC=F`, `CL=F`, `KRW=X`, `JPYKRW=X`. Gold and WTI are futures, in USD per troy ounce/barrel. JPY prices and absolute changes are multiplied by 100; percentage change is unchanged. Market indices display points, not currency. This public endpoint has no availability guarantee. Provider adapters belong in the collector, not in browser code.

## Deployment and refresh

GitHub Pages uses the **GitHub Actions** publishing source, retaining `jujin.dev` as the custom domain. `.github/workflows/pages.yml` runs on main pushes, manual dispatch, and at minutes 17 and 47 of each UTC hour. It tests, collects data, uploads `dist/`, and deploys it. Generated snapshots are never committed. Deployments are serialized.

Transient upstream failures retain individual last-good quotes/feed with their original `collectedAt`. Missing initial data fails the build instead of publishing fake values. The UI labels collection ages over 90 minutes as delayed. Visitors revalidate visible static JSON every five minutes and when returning to the tab. Failed browser refreshes retain the previously loaded data.

GitHub schedules can be delayed and public-repository schedules can be disabled after 60 days without repository activity. This is a best-effort 30-minute refresh, not a real-time quote service. Inspect Actions warnings/failures and the published collection timestamps when diagnosing freshness. To recover: re-enable the workflow if disabled, then run **Dashboard Pages → Run workflow**. Verify a subsequent scheduled run as well. Do not refresh timestamps on reused data.

After release, verify the main and Apps routes, all three JSON endpoints, mobile/desktop and light/dark layouts, language persistence, keyboard/touch editing, and one scheduled refresh. For rollback, revert the source change and rerun the workflow; if restoring the former buildless site, also restore Pages publishing to main/root.
