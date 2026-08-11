import type { QuartzComponent, QuartzComponentConstructor } from "@quartz-community/types"

const languages = ["ko", "en", "ja", "zh"] as const
type Language = (typeof languages)[number]
const languageNames: Record<Language, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  zh: "中文",
}
const suffix = /\.(ko|en|ja|zh)$/

function baseSlug(slug: string) {
  return slug.replace(suffix, "")
}
function languageFor(slug: string, value: unknown): Language | undefined {
  if (typeof value === "string" && languages.includes(value as Language)) return value as Language
  return slug.match(suffix)?.[1] as Language | undefined
}

function resolveVariantHref(currentSlug: string, targetSlug: string): string {
  if (currentSlug === targetSlug) return "#"
  const currentDirectory = currentSlug === "index" ? [] : currentSlug.split("/").slice(0, -1)
  const target = targetSlug === "index" ? [] : targetSlug.split("/")
  while (currentDirectory[0] === target[0] && currentDirectory.length > 0) {
    currentDirectory.shift()
    target.shift()
  }
  const relative = `${"../".repeat(currentDirectory.length)}${target.join("/")}`
  return relative || "./"
}

const style = `
.language-selector { align-items: center; border-bottom: 1px solid var(--lightgray); display: flex; flex-wrap: wrap; gap: .75rem; margin-bottom: 1rem; padding: .75rem 0; font-size: .9rem; }
.language-selector__label { color: var(--gray); font-weight: 500; }
.language-selector__list { display: flex; flex-wrap: wrap; gap: .5rem; list-style: none; margin: 0; padding: 0; }
.language-selector__link { background: var(--lightgray); border-radius: .4rem; color: var(--dark); display: inline-block; font-size: .85rem; font-weight: 500; padding: .3rem .75rem; text-decoration: none; }
.language-selector__link:hover { background: var(--gray); color: var(--light); }
.language-selector__link--current { background: var(--secondary); color: var(--light); cursor: default; }
@media (max-width: 768px) { .language-selector { align-items: flex-start; flex-direction: column; gap: .5rem; } }
`

const clientScript = `
const languagePreferenceCookie = "jujin_language_preference"
const readLanguagePreference = () => document.cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith(languagePreferenceCookie + "="))?.split("=").slice(1).join("=")
const writeLanguagePreference = (language) => { document.cookie = languagePreferenceCookie + "=" + encodeURIComponent(language) + "; path=/; SameSite=Lax; Max-Age=31536000" }
const configureLanguageSelector = () => {
  const selector = document.querySelector("[data-language-selector]")
  if (!selector) return
  const payload = JSON.parse(selector.dataset.languageSelector || "{}")
  const preferred = readLanguagePreference() && decodeURIComponent(readLanguagePreference())
  const target = payload.variants?.find((variant) => variant.code === preferred)
  if (target && target.code !== payload.currentLang && target.href) { window.location.assign(target.href); return }
  if (payload.isTranslation && payload.currentLang) writeLanguagePreference(payload.currentLang)
  selector.querySelectorAll("a[data-language-code]").forEach((link) => link.addEventListener("click", () => writeLanguagePreference(link.dataset.languageCode), { once: true }))
}
document.addEventListener("nav", configureLanguageSelector)
document.addEventListener("render", configureLanguageSelector)
`

export const LanguageSelector: QuartzComponentConstructor = () => {
  const Component: QuartzComponent = ({ fileData, allFiles, displayClass }) => {
    const currentSlug = typeof fileData.slug === "string" ? fileData.slug : ""
    if (!currentSlug) return null
    const base = baseSlug(currentSlug)
    const currentLanguage = languageFor(currentSlug, fileData.frontmatter?.lang)
    if (!currentLanguage) return null
    const variants = allFiles
      .flatMap((file) => {
        const slug = typeof file.slug === "string" ? file.slug : ""
        const language = languageFor(slug, file.frontmatter?.lang)
        if (!slug || baseSlug(slug) !== base || !language) return []
        return [
          { code: language, href: resolveVariantHref(currentSlug, slug), original: slug === base },
        ]
      })
      .sort((left, right) => languages.indexOf(left.code) - languages.indexOf(right.code))
    if (variants.length <= 1) return null
    const payload = JSON.stringify({
      currentLang: currentLanguage,
      isTranslation: currentSlug !== base,
      variants,
    })
    return (
      <div class={`language-selector ${displayClass ?? ""}`} data-language-selector={payload}>
        <span class="language-selector__label">Language</span>
        <ul class="language-selector__list">
          {variants.map((variant) => (
            <li>
              {variant.code === currentLanguage ? (
                <span class="language-selector__link language-selector__link--current">
                  {variant.original ? "📝 " : "🌐 "}
                  {languageNames[variant.code]}
                </span>
              ) : (
                <a
                  class="language-selector__link"
                  href={variant.href}
                  data-language-code={variant.code}
                >
                  {variant.original ? "📝 " : "🌐 "}
                  {languageNames[variant.code]}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    )
  }
  Component.css = style
  Component.afterDOMLoaded = clientScript
  return Component
}
