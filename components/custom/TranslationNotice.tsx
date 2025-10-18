import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { FullSlug } from "../../quartz/util/path"
import style from "./TranslationNotice.scss"

export default (() => {
  const TranslationNotice: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    const currentSlug = fileData.slug as FullSlug

    // slug에 .이 포함되어 있으면 번역본 (예: index.ko, post.ja)
    const isTranslation = currentSlug.includes(".")

    if (!isTranslation) {
      return null
    }

    return (
      <div class={`translation-notice ${displayClass ?? ""}`}>
        <p class="translation-notice__text">
          <span class="translation-notice__icon">🤖</span>
          이 글은 AI번역되었습니다.
        </p>
      </div>
    )
  }

  TranslationNotice.css = style
  return TranslationNotice
}) satisfies QuartzComponentConstructor
