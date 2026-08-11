import type { QuartzComponent, QuartzComponentConstructor } from "@quartz-community/types"

const messages: Record<string, string> = {
  ko: "이 글은 AI 번역되었습니다.",
  en: "This article was translated by AI.",
  ja: "この記事はAIによって翻訳されました。",
  zh: "本文由 AI 翻译。",
}

const style = `
.translation-notice { background: var(--highlight); border-left: 4px solid var(--secondary); border-radius: .4rem; font-size: .9rem; margin-bottom: 1.5rem; padding: .75rem 1rem; }
.translation-notice p { align-items: center; color: var(--darkgray); display: flex; font-weight: 500; gap: .5rem; margin: 0; }
`

export const TranslationNotice: QuartzComponentConstructor = () => {
  const Component: QuartzComponent = ({ fileData, displayClass }) => {
    const slug = typeof fileData.slug === "string" ? fileData.slug : ""
    const language =
      typeof fileData.frontmatter?.lang === "string" ? fileData.frontmatter.lang : "en"
    if (!/\.(?:ko|en|ja|zh)$/.test(slug)) return null
    return (
      <div class={`translation-notice ${displayClass ?? ""}`}>
        <p>
          <span>🤖</span>
          {messages[language] ?? messages.en}
        </p>
      </div>
    )
  }
  Component.css = style
  return Component
}
