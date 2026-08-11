import fs from "node:fs/promises"
import path from "node:path"

import { Repository } from "@napi-rs/simple-git"
import type { QuartzTransformerPlugin } from "@quartz-community/types"
import { parse as parseYaml } from "yaml"

const translationSuffix = /\.(?:ko|en|ja|zh)\.md$/

type DateProvenance = "frontmatter" | "git" | "filesystem"
type FrontmatterDates = {
  created?: unknown
  modified?: unknown
  published?: unknown
}
type DateData = {
  created: Date
  modified: Date
  published: Date
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function asDate(value: unknown): Date | undefined {
  if (value === undefined || value === null || value === "") return undefined

  const date = value instanceof Date ? value : new Date(String(value))
  return Number.isNaN(date.getTime()) ? undefined : date
}

function sourcePathFor(filePath: string): string {
  const filename = path.basename(filePath)
  if (!translationSuffix.test(filename)) return filePath

  return path.join(path.dirname(filePath), filename.replace(translationSuffix, ".md"))
}

async function readFrontmatter(filePath: string): Promise<FrontmatterDates> {
  const contents = await fs.readFile(filePath, "utf8")
  const match = contents.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  if (!match) return {}

  const frontmatter = parseYaml(match[1])
  return isRecord(frontmatter) ? frontmatter : {}
}

function getDateMetadata(data: FrontmatterDates): {
  created?: Date
  modified?: Date
  published?: Date
} {
  return {
    created: asDate(data.created),
    modified: asDate(data.modified),
    published: asDate(data.published),
  }
}

const DateMetadata: QuartzTransformerPlugin = () => ({
  name: "DateMetadata",
  markdownPlugins(ctx) {
    let repository: Repository | undefined
    let repositoryWorkdir: string | undefined

    try {
      repository = Repository.discover(ctx.argv.directory)
      repositoryWorkdir = repository.workdir() ?? ctx.argv.directory
    } catch {
      repository = undefined
    }

    const getFallbackDate = async (
      sourcePath: string,
    ): Promise<{ date: Date; provenance: Exclude<DateProvenance, "frontmatter"> }> => {
      if (repository && repositoryWorkdir) {
        try {
          const relativePath = path.relative(repositoryWorkdir, sourcePath)
          const timestamp = await repository.getFileLatestModifiedDateAsync(relativePath)
          return { date: new Date(timestamp), provenance: "git" }
        } catch {
          // Fall through to the filesystem timestamp when Git cannot resolve a file.
        }
      }

      const stats = await fs.stat(sourcePath)
      return { date: new Date(stats.mtimeMs), provenance: "filesystem" }
    }

    return [
      () => async (_tree, file) => {
        const filePath = String(file.data.filePath ?? file.path)
        const sourcePath = sourcePathFor(filePath)
        const metadata = getDateMetadata(await readFrontmatter(sourcePath))
        const fallback = metadata.created ? undefined : await getFallbackDate(sourcePath)
        const created = metadata.created ?? fallback!.date

        const dates: DateData = {
          created,
          modified: metadata.modified ?? created,
          published: metadata.published ?? created,
        }

        Object.assign(file.data, {
          dates,
          defaultDateType: "published",
          dateMetadataSource: metadata.created ? "frontmatter" : fallback!.provenance,
        })
      },
    ]
  },
})

export default DateMetadata
