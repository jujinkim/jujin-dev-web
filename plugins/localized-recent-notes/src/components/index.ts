import { RecentNotes, type RecentNotesOptions } from "@quartz-community/recent-notes"
import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types"

const languages = ["ko", "en", "ja", "zh"] as const
type Language = (typeof languages)[number]
type Page = QuartzComponentProps["allFiles"][number]

const languageSuffix = /\.(ko|en|ja|zh)$/

function slugOf(file: Page): string {
  return typeof file.slug === "string" ? file.slug : ""
}

function languageFor(file: Page): Language {
  const configuredLanguage = file.frontmatter?.lang
  if (
    typeof configuredLanguage === "string" &&
    languages.includes(configuredLanguage as Language)
  ) {
    return configuredLanguage as Language
  }
  return (slugOf(file).match(languageSuffix)?.[1] as Language | undefined) ?? "ko"
}

function isPublished(file: Page): boolean {
  const publish = file.frontmatter?.publish
  return publish === true || publish === "true"
}

function baseSlug(slug: string): string {
  return slug.replace(languageSuffix, "")
}

function choosePreferred(current: Page | undefined, candidate: Page, base: string): Page {
  if (!current || slugOf(candidate) === base) return candidate
  return current
}

export function selectLocalizedRecentNotes(allFiles: Page[], language: Language): Page[] {
  const grouped = new Map<string, { fallback?: Page; preferred?: Page }>()

  for (const file of allFiles) {
    const slug = slugOf(file)
    if (!slug || !isPublished(file)) continue

    const base = baseSlug(slug)
    const group = grouped.get(base) ?? {}
    const fileLanguage = languageFor(file)

    if (fileLanguage === "ko") {
      group.fallback = choosePreferred(group.fallback, file, base)
    }
    if (fileLanguage === language) {
      group.preferred = choosePreferred(group.preferred, file, base)
    }

    grouped.set(base, group)
  }

  return [...grouped.values()].flatMap((group): Page[] => {
    const selected = group.preferred ?? group.fallback
    return selected ? [selected] : []
  })
}

export const LocalizedRecentNotes: QuartzComponentConstructor<Partial<RecentNotesOptions>> = (
  options,
) => {
  const UpstreamRecentNotes = RecentNotes({
    title: "Recent Notes",
    limit: 5,
    linkToMore: false,
    showTags: true,
    ...options,
  })

  const Component: QuartzComponent = (props) => {
    const language = languageFor(props.fileData)
    return UpstreamRecentNotes({
      ...props,
      allFiles: selectLocalizedRecentNotes(props.allFiles, language),
    })
  }
  Component.css = UpstreamRecentNotes.css
  return Component
}
