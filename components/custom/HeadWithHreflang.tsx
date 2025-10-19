import { JSX } from "preact"
import { i18n } from "../../quartz/i18n"
import { FullSlug, getFileExtension, joinSegments, pathToRoot } from "../../quartz/util/path"
import { CSSResourceToStyleElement, JSResourceToScriptElement } from "../../quartz/util/resources"
import { googleFontHref, googleFontSubsetHref } from "../../quartz/util/theme"
import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../quartz/components/types"
import { unescapeHTML } from "../../quartz/util/escape"
import { CustomOgImagesEmitterName } from "../../quartz/plugins/emitters/ogImage"

export default (() => {
  const SUPPORTED_LANGUAGES = ["ko", "en", "ja", "zh"] as const

  const stripLanguageSuffix = (slug: string): string => {
    for (const lang of SUPPORTED_LANGUAGES) {
      const suffix = `.${lang}`
      if (slug.endsWith(suffix)) {
        return slug.slice(0, -suffix.length)
      }
    }
    return slug
  }

  const HeadWithHreflang: QuartzComponent = ({
    cfg,
    fileData,
    externalResources,
    ctx,
    allFiles,
  }: QuartzComponentProps) => {
    const titleSuffix = cfg.pageTitleSuffix ?? ""
    const title =
      (fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title) + titleSuffix
    const description =
      fileData.frontmatter?.socialDescription ??
      fileData.frontmatter?.description ??
      unescapeHTML(fileData.description?.trim() ?? i18n(cfg.locale).propertyDefaults.description)

    const { css, js, additionalHead } = externalResources

    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    const path = url.pathname as FullSlug
    const baseDir = fileData.slug === "404" ? path : pathToRoot(fileData.slug!)
    const iconPath = joinSegments(baseDir, "static/icon.png")

    // Url of current page
    const socialUrl =
      fileData.slug === "404" ? url.toString() : joinSegments(url.toString(), fileData.slug!)

    const usesCustomOgImage = ctx.cfg.plugins.emitters.some(
      (e) => e.name === CustomOgImagesEmitterName,
    )
    const ogImageDefaultPath = `https://${cfg.baseUrl}/static/og-image.png`

    // Generate hreflang tags
    const currentLang = fileData.frontmatter?.lang as string | undefined
    const hreflangTags: JSX.Element[] = []

    if (currentLang && cfg.baseUrl) {
      const currentSlug = fileData.slug as FullSlug
      const baseSlug = stripLanguageSuffix(currentSlug)
      const languageMap = new Map<string, FullSlug>()

      for (const file of allFiles) {
        const slug = file.slug as FullSlug | undefined
        const lang = file.frontmatter?.lang as string | undefined
        if (!slug || !lang) {
          continue
        }

        if (stripLanguageSuffix(slug) === baseSlug) {
          languageMap.set(lang, slug)
        }
      }

      if (!languageMap.has(currentLang)) {
        languageMap.set(currentLang, currentSlug)
      }

      const originalSlug =
        [...languageMap.values()].find((slug) => stripLanguageSuffix(slug) === slug) ?? currentSlug

      if (originalSlug) {
        hreflangTags.push(
          <link
            key="hreflang-x-default"
            rel="alternate"
            hrefLang="x-default"
            href={`https://${cfg.baseUrl}/${originalSlug}`}
          />,
        )
      }

      const orderedLanguages = [
        ...SUPPORTED_LANGUAGES.filter((lang) => languageMap.has(lang)),
        ...Array.from(languageMap.keys()).filter(
          (lang) => !(SUPPORTED_LANGUAGES as readonly string[]).includes(lang),
        ),
      ]

      for (const lang of orderedLanguages) {
        const slug = languageMap.get(lang)
        if (!slug) {
          continue
        }

        hreflangTags.push(
          <link
            key={`hreflang-${lang}`}
            rel="alternate"
            hrefLang={lang}
            href={`https://${cfg.baseUrl}/${slug}`}
          />,
        )
      }
    }

    return (
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        {cfg.theme.cdnCaching && cfg.theme.fontOrigin === "googleFonts" && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link rel="stylesheet" href={googleFontHref(cfg.theme)} />
            {cfg.theme.typography.title && (
              <link rel="stylesheet" href={googleFontSubsetHref(cfg.theme, cfg.pageTitle)} />
            )}
          </>
        )}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta name="og:site_name" content={cfg.pageTitle}></meta>
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:image:alt" content={description} />

        {!usesCustomOgImage && (
          <>
            <meta property="og:image" content={ogImageDefaultPath} />
            <meta property="og:image:url" content={ogImageDefaultPath} />
            <meta name="twitter:image" content={ogImageDefaultPath} />
            <meta
              property="og:image:type"
              content={`image/${getFileExtension(ogImageDefaultPath) ?? "png"}`}
            />
          </>
        )}

        {cfg.baseUrl && (
          <>
            <meta property="twitter:domain" content={cfg.baseUrl}></meta>
            <meta property="og:url" content={socialUrl}></meta>
            <meta property="twitter:url" content={socialUrl}></meta>
          </>
        )}

        <link rel="icon" href={iconPath} />
        <meta name="description" content={description} />
        <meta name="generator" content="Quartz" />

        {/* hreflang tags for multilingual SEO */}
        {hreflangTags}

        {css.map((resource) => CSSResourceToStyleElement(resource, true))}
        {js
          .filter((resource) => resource.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
        {additionalHead.map((resource) => {
          if (typeof resource === "function") {
            return resource(fileData)
          } else {
            return resource
          }
        })}
      </head>
    )
  }

  return HeadWithHreflang
}) satisfies QuartzComponentConstructor
