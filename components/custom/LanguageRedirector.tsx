import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { buildLanguageVariants } from "./languageVariants"

// @ts-ignore - bundled at build time
import script from "./LanguageRedirector.inline"

export default (() => {
  const LanguageRedirector: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
    const variants = buildLanguageVariants(fileData, allFiles)
    if (!variants || variants.variants.length <= 1) {
      return null
    }

    const payload = {
      currentLang: variants.currentLang ?? null,
      isTranslated: variants.isTranslatedVersion,
      variants: variants.variants.map((variant) => ({
        code: variant.code,
        href: variant.href,
      })),
    }

    return (
      <div
        class="language-redirector"
        hidden
        data-language-preference={JSON.stringify(payload)}
      />
    )
  }

  LanguageRedirector.afterDOMLoaded = script
  return LanguageRedirector
}) satisfies QuartzComponentConstructor
