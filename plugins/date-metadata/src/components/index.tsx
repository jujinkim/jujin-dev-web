import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types"

type DateProvenance = "frontmatter" | "git" | "filesystem"
type DateData = {
  created?: Date
  modified?: Date
  published?: Date
}
type DateMetadataFileData = QuartzComponentProps["fileData"] & {
  dateMetadataSource?: DateProvenance
}

const wordsPerMinute = 200

function formatDate(date: Date, locale: string): string {
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "Asia/Seoul",
  })
}

function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

const style = `
.date-metadata { color: var(--darkgray); margin-top: 0; }
.date-metadata > *:not(:last-child) { margin-right: 8px; }
.date-metadata > *:not(:last-child)::after { content: ","; margin-left: 8px; }
.date-metadata__git-fallback { opacity: .55; text-decoration: line-through; text-decoration-thickness: 1px; }
`

export const DateMetadata: QuartzComponentConstructor = () => {
  const Component: QuartzComponent = ({ cfg, fileData, displayClass }) => {
    const metadata = fileData as DateMetadataFileData
    const dates = metadata.dates as DateData | undefined
    const date = dates?.published ?? dates?.created
    if (!date) return null

    const source = metadata.dateMetadataSource
    const isGitFallback = source === "git" || source === "filesystem"
    const text = fileData.text

    return (
      <p class={`date-metadata ${displayClass ?? ""}`}>
        <time
          class={isGitFallback ? "date-metadata__git-fallback" : undefined}
          datetime={date.toISOString()}
          title={
            isGitFallback ? "created 메타데이터 없음: Git 또는 파일시스템 수정 시각" : undefined
          }
        >
          {formatDate(date, cfg.locale ?? "en-US")}
        </time>
        {text && <span>{`${readingMinutes(text)} min read`}</span>}
      </p>
    )
  }

  Component.css = style
  return Component
}
