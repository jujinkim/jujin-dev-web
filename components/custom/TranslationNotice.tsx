import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { FullSlug } from "../../quartz/util/path"
import style from "./TranslationNotice.scss"

const TRANSLATION_MESSAGES: Record<string, string> = {
  ko: "이 글은 AI번역되었습니다.",
  en: "This article was translated by AI.",
  ja: "この記事はAIによって翻訳されました。",
  zh: "本文由AI翻译。",
}

export default (() => {
  const TranslationNotice: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    const currentSlug = fileData.slug as FullSlug
    const currentLang = fileData.frontmatter?.lang as string | undefined

    // slug에 .이 포함되어 있으면 번역본 (예: index.ko, post.ja)
    const isTranslation = currentSlug.includes(".")

    if (!isTranslation) {
      return null
    }

    const message = currentLang
      ? (TRANSLATION_MESSAGES[currentLang] || TRANSLATION_MESSAGES.en)
      : TRANSLATION_MESSAGES.en

    return (
      <div class={`translation-notice ${displayClass ?? ""}`}>
        <p class="translation-notice__text">
          <span class="translation-notice__icon">🤖</span>
          {message}
        </p>
      </div>
    )
  }

  TranslationNotice.css = style
  return TranslationNotice
}) satisfies QuartzComponentConstructor
