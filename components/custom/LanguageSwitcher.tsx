import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../quartz/components/types"
import style from "./LanguageSwitcher.scss"
// @ts-ignore - bundled at build time
import script from "./LanguageSwitcher.inline"
import {
  buildLanguageVariants,
  SupportedLanguage,
} from "./languageVariants"

interface LanguageInfo {
  code: SupportedLanguage
  name: string
  href: string
  isOriginal: boolean
}

const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  zh: "中文",
}

export default (() => {
  const LanguageSwitcher: QuartzComponent = ({
    fileData,
    displayClass,
    allFiles,
  }: QuartzComponentProps) => {
    const variants = buildLanguageVariants(fileData, allFiles)
    if (!variants) {
      return null
    }

    const currentLang = variants.currentLang
    if (!currentLang) {
      return null
    }

    const languages: LanguageInfo[] = variants.variants.map((variant) => ({
      code: variant.code,
      href: variant.href,
      isOriginal: variant.isOriginal,
      name: variant.isOriginal
        ? `📝 ${LANGUAGE_NAMES[variant.code]}`
        : `🌐 ${LANGUAGE_NAMES[variant.code]}`,
    }))

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

            return (
              <li class="language-switcher__item">
                {isCurrent ? (
                  <span class="language-switcher__link language-switcher__link--current">
                    {lang.name}
                  </span>
                ) : (
                  <a href={lang.href} class="language-switcher__link" data-lang-code={lang.code}>
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
  LanguageSwitcher.afterDOMLoaded = script
  return LanguageSwitcher
}) satisfies QuartzComponentConstructor
