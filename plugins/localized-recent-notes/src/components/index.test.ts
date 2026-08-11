import assert from "node:assert/strict"
import test from "node:test"
import { selectLocalizedRecentNotes } from "./index"

function page(slug: string, lang: string, publish = true) {
  return {
    slug,
    frontmatter: { lang, publish },
  } as any
}

test("selects active-language pages and Korean fallbacks once per article", () => {
  const selected = selectLocalizedRecentNotes(
    [
      page("guide", "ko"),
      page("guide.en", "en"),
      page("guide.ja", "ja"),
      page("korean-only", "ko"),
      page("hidden.en", "en", false),
    ],
    "en",
  )

  assert.deepStrictEqual(
    selected.map((file) => file.slug),
    ["guide.en", "korean-only"],
  )
})

test("uses Korean originals when no active-language translation exists", () => {
  const selected = selectLocalizedRecentNotes(
    [page("guide", "ko"), page("guide.en", "en"), page("korean-only", "ko")],
    "ja",
  )

  assert.deepStrictEqual(
    selected.map((file) => file.slug),
    ["guide", "korean-only"],
  )
})
