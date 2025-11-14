import { QuartzPluginData } from "../../quartz/plugins/vfile"
import { FullSlug, RelativeURL, resolveRelative } from "../../quartz/util/path"

export const SUPPORTED_LANGUAGES = ["ko", "en", "ja", "zh"] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export interface LanguageVariant {
  code: SupportedLanguage
  slug: FullSlug
  href: RelativeURL
  isOriginal: boolean
}

export interface LanguageVariantsResult {
  currentLang?: SupportedLanguage
  currentSlug: FullSlug
  baseSlug: string
  isTranslatedVersion: boolean
  variants: LanguageVariant[]
}

const getLanguageCode = (value?: string): SupportedLanguage | undefined => {
  if (!value) {
    return undefined
  }

  return SUPPORTED_LANGUAGES.find((lang) => lang === value)
}

const stripLanguageSuffix = (slug: string): string => {
  for (const lang of SUPPORTED_LANGUAGES) {
    const suffix = `.${lang}`
    if (slug.endsWith(suffix)) {
      return slug.slice(0, -suffix.length)
    }
  }
  return slug
}

const buildVariant = (
  code: SupportedLanguage,
  sourceSlug: FullSlug,
  candidateSlug: FullSlug,
): LanguageVariant => {
  const href = resolveRelative(sourceSlug, candidateSlug)
  const baseSlug = stripLanguageSuffix(sourceSlug)
  return {
    code,
    slug: candidateSlug,
    href,
    isOriginal: candidateSlug === baseSlug,
  }
}

export const buildLanguageVariants = (
  fileData: QuartzPluginData,
  allFiles: QuartzPluginData[],
): LanguageVariantsResult | null => {
  const currentSlug = fileData.slug as FullSlug | undefined
  if (!currentSlug) {
    return null
  }

  const baseSlug = stripLanguageSuffix(currentSlug)
  const currentLang = getLanguageCode(fileData.frontmatter?.lang as string | undefined)

  const languageMap = new Map<SupportedLanguage, LanguageVariant>()

  for (const candidate of allFiles) {
    const candidateSlug = candidate.slug as FullSlug | undefined
    if (!candidateSlug) {
      continue
    }

    if (stripLanguageSuffix(candidateSlug) !== baseSlug) {
      continue
    }

    const candidateLang = getLanguageCode(candidate.frontmatter?.lang as string | undefined)
    if (!candidateLang) {
      continue
    }

    languageMap.set(candidateLang, buildVariant(candidateLang, currentSlug, candidateSlug))
  }

  if (currentLang && !languageMap.has(currentLang)) {
    // Ensure the current document is always represented
    languageMap.set(
      currentLang,
      buildVariant(currentLang, currentSlug, currentSlug),
    )
  }

  const variants = SUPPORTED_LANGUAGES.flatMap((lang) => {
    const variant = languageMap.get(lang)
    if (!variant) {
      return []
    }
    return [variant]
  })

  return {
    currentLang,
    currentSlug,
    baseSlug,
    isTranslatedVersion: currentSlug !== baseSlug,
    variants,
  }
}
