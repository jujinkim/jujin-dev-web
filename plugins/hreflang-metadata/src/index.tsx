import type { QuartzTransformerPlugin } from "@quartz-community/types"

const languages = ["ko", "en", "ja", "zh"] as const
const suffix = /\.(ko|en|ja|zh)$/
const baseSlug = (slug: string) => slug.replace(suffix, "")
const languageFor = (slug: string) => slug.match(suffix)?.[1] ?? "ko"
const pageUrl = (baseUrl: string, slug: string) =>
  `https://${baseUrl}${slug === "index" ? "/" : `/${slug}`}`

const HreflangMetadata: QuartzTransformerPlugin = () => ({
  name: "HreflangMetadata",
  textTransform: (_ctx, source) => source,
  externalResources(ctx) {
    const variants = new Map<string, Map<string, string>>()
    for (const slug of ctx.allSlugs) {
      const value = String(slug)
      const base = baseSlug(value)
      const language = languageFor(value)
      const map = variants.get(base) ?? new Map<string, string>()
      map.set(language, value)
      variants.set(base, map)
    }
    return {
      additionalHead: [
        (fileData: { slug?: string }) => {
          const slug = fileData.slug
          const baseUrl = ctx.cfg.configuration.baseUrl
          if (!slug || !baseUrl) return null
          const languageMap = variants.get(baseSlug(slug))
          if (!languageMap || languageMap.size === 0) return null
          const fallback = languageMap.get("ko") ?? languageMap.values().next().value
          return (
            <>
              <link rel="canonical" href={pageUrl(baseUrl, slug)} />
              {fallback && (
                <link rel="alternate" hrefLang="x-default" href={pageUrl(baseUrl, fallback)} />
              )}
              {languages.map((language) => {
                const variant = languageMap.get(language)
                return variant ? (
                  <link rel="alternate" hrefLang={language} href={pageUrl(baseUrl, variant)} />
                ) : null
              })}
            </>
          )
        },
      ],
    }
  },
})

export default HreflangMetadata
