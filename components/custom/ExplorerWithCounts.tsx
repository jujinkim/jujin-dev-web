import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../quartz/components/types"
import { VNode, JSX } from "preact"
import { FileTrieNode } from "../../quartz/util/fileTrie"
import { trieFromAllFiles } from "../../quartz/util/ctx"

import style from "./ExplorerWithCounts.scss"
// @ts-ignore - bundled at build time
import script from "./ExplorerWithCounts.inline"

type CountableNode = FileTrieNode<any>

const countPages = (node: CountableNode): number => {
  let total = 0

  if (!node.isFolder && node.data) {
    // 번역본 제외: slug에 .이 포함되어 있으면 제외
    const slug = node.slug || ""
    const slugParts = slug.split("/")
    const lastPart = slugParts[slugParts.length - 1]
    if (!lastPart.includes(".")) {
      total += 1
    }
  }

  for (const child of node.children) {
    total += countPages(child)
  }

  return total
}

const renderFolder = (node: CountableNode, depth = 0): VNode | null => {
  if (!node.isFolder) {
    return null
  }

  const childFolders = node.children.filter((child) => child.isFolder)
  const descendantCount = countPages(node)
  const folderSlug = node.slug

  return (
    <li
      class="custom-explorer__folder-item"
      data-depth={depth}
      style={{ "--depth": `${depth}` } as JSX.CSSProperties}
    >
      <button
        type="button"
        class="custom-explorer__folder"
        data-folder-slug={folderSlug}
        data-folder-name={node.displayName}
      >
        <span class="custom-explorer__folder-label">{node.displayName}</span>
        <span class="custom-explorer__count">({descendantCount})</span>
      </button>
      {childFolders.length > 0 && (
        <ul class="custom-explorer__folder-children">
          {childFolders.map((child) => renderFolder(child, depth + 1))}
        </ul>
      )}
    </li>
  )
}

let explorerInstance = 0

export default (() => {
  const ExplorerWithCounts: QuartzComponent = (props: QuartzComponentProps) => {
    const { allFiles, ctx } = props
    const trie = (ctx.trie ??= trieFromAllFiles(allFiles))
    const rootFolders = trie.children.filter((child) => child.isFolder)
    const loosePagesCount = allFiles.filter((file) => {
      const slug = file.slug as string | undefined
      if (!slug) return false

      // 루트에 존재하는 원본 문서만 카운트 (번역본 제외)
      if (slug.includes("/")) return false
      const parts = slug.split("/")
      const lastPart = parts[parts.length - 1]
      return !lastPart.includes(".")
    }).length

    if (rootFolders.length === 0 && loosePagesCount === 0) {
      return null
    }

    const instanceId = `custom-explorer-${explorerInstance++}`
    const foldersId = `${instanceId}-folders`
    const panelId = `${instanceId}-panel`

    return (
      <nav class="custom-explorer" aria-label="Site navigation">
        <button
          type="button"
          class="custom-explorer__toggle explorer-toggle mobile-explorer hide-until-loaded"
          aria-expanded="false"
          aria-controls={foldersId}
          aria-label="카테고리 메뉴 토글"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="custom-explorer__toggle-icon"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
        <div class="custom-explorer__folders" id={foldersId} aria-hidden="false">
          <button
            type="button"
            class="custom-explorer__nav-close mobile-only"
            aria-label="메뉴 닫기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <ul class="custom-explorer__folder-list">
            {loosePagesCount > 0 && (
              <li class="custom-explorer__folder-item" data-depth={0}>
                <button
                  type="button"
                  class="custom-explorer__folder"
                  data-folder-slug=""
                  data-folder-name="루트"
                >
                  <span class="custom-explorer__folder-label">루트</span>
                  <span class="custom-explorer__count">({loosePagesCount})</span>
                </button>
              </li>
            )}
            {rootFolders.map((folder) => renderFolder(folder, 0))}
          </ul>
        </div>
        <div class="custom-explorer__panel" aria-hidden="true" role="dialog" id={panelId}>
          <div class="custom-explorer__panel-header">
            <button type="button" class="custom-explorer__back">
              ←
            </button>
            <h3 class="custom-explorer__panel-title"></h3>
          </div>
          <ul class="custom-explorer__panel-list"></ul>
        </div>
        <div class="custom-explorer__overlay" aria-hidden="true"></div>
      </nav>
    )
  }

  ExplorerWithCounts.css = style
  ExplorerWithCounts.afterDOMLoaded = script

  return ExplorerWithCounts
}) satisfies QuartzComponentConstructor
