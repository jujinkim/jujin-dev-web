# Demo fonts

Self-hosted WOFF2 subsets of Noto Serif, Noto Sans, Dancing Script, JetBrains Mono,
Noto Serif KR/JP, and Noto Sans KR/JP from the Google Fonts repository.

`manifest.json` records original download URLs, source SHA-256 hashes, license
paths, and every retained Unicode character. Each family includes its upstream
SIL Open Font License 1.1 file. Subsetting preserves naming and layout tables.

The CJK subsets cover the authored demo strings, not arbitrary Korean/Japanese
input. Other characters may use the browser's fallback. Latin width experiments
use DOM Range measurements of the loaded font, not font names or estimated
character cells. Fonts are specimens, not product recommendations.

See `scripts/subset-design-fonts.py` and `docs/design-demos.md` in the repository
for regeneration instructions. Review upstream hash changes before regeneration.
