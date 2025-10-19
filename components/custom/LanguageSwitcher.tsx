import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../quartz/components/types"
import { resolveRelative, FullSlug } from "../../quartz/util/path"
import style from "./LanguageSwitcher.scss"

interface LanguageInfo {
  code: string
  name: string
  slug?: FullSlug
}

const LANGUAGE_NAMES: Record<string, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  zh: "中文",
}

const SUPPORTED_LANGUAGES = ["ko", "en", "ja", "zh"] as const

export default (() => {
  const stripLanguageSuffix = (slug: string): string => {
    for (const lang of SUPPORTED_LANGUAGES) {
      const suffix = `.${lang}`
      if (slug.endsWith(suffix)) {
        return slug.slice(0, -suffix.length)
      }
    }
    return slug
  }

  const isSupportedLanguage = (lang: string): boolean => {
    return (SUPPORTED_LANGUAGES as readonly string[]).includes(lang)
  }

  const LanguageSwitcher: QuartzComponent = ({
    fileData,
    displayClass,
    allFiles,
  }: QuartzComponentProps) => {
    const frontmatter = fileData.frontmatter
    const currentLang = frontmatter?.lang as string | undefined

    // 현재 언어가 없으면 컴포넌트 렌더링 안 함
    if (!currentLang) {
      return null
    }

    const currentSlug = fileData.slug as FullSlug
    const baseSlug = stripLanguageSuffix(currentSlug)

    // 모든 가능한 언어를 수집
    const languageMap = new Map<string, FullSlug>()

    for (const file of allFiles) {
      const slug = file.slug as FullSlug | undefined
      const lang = file.frontmatter?.lang as string | undefined
      if (!slug || !lang || !isSupportedLanguage(lang)) {
        continue
      }

      if (stripLanguageSuffix(slug) === baseSlug) {
        languageMap.set(lang, slug)
      }
    }

    if (currentLang && isSupportedLanguage(currentLang) && !languageMap.has(currentLang)) {
      languageMap.set(currentLang, currentSlug)
    }

    // 고정된 순서로 정렬
    const languages: LanguageInfo[] = SUPPORTED_LANGUAGES.flatMap((lang) => {
      if (!languageMap.has(lang)) {
        return []
      }

      const slug = languageMap.get(lang)!
      const isOriginal = stripLanguageSuffix(slug) === slug

      return [
        {
          code: lang,
          name: isOriginal
            ? `📝 ${LANGUAGE_NAMES[lang] || lang.toUpperCase()}`
            : `🌐 ${LANGUAGE_NAMES[lang] || lang.toUpperCase()}`,
          slug,
        },
      ]
    })

    // 언어가 하나뿐이면 (번역본 없음) 렌더링 안 함
    if (languages.length <= 1) {
      return null
    }

    return (
      <div class={`language-switcher ${displayClass ?? ""}`}>
        <div class="language-switcher__label">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span>Language</span>
        </div>
        <ul class="language-switcher__list">
          {languages.map((lang) => {
            const isCurrent = lang.code === currentLang
            const href = lang.slug ? resolveRelative(currentSlug, lang.slug) : "#"

            return (
              <li class="language-switcher__item">
                {isCurrent ? (
                  <span class="language-switcher__link language-switcher__link--current">
                    {lang.name}
                  </span>
                ) : (
                  <a href={href} class="language-switcher__link">
                    {lang.name}
                  </a>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  LanguageSwitcher.css = style
  return LanguageSwitcher
}) satisfies QuartzComponentConstructor
