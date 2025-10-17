import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
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
    total += 1
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
    const loosePages = trie.children.filter((child) => !child.isFolder && child.data)

    if (rootFolders.length === 0 && loosePages.length === 0) {
      return null
    }

    const instanceId = `custom-explorer-${explorerInstance++}`
    const foldersId = `${instanceId}-folders`

    return (
      <nav class="custom-explorer" aria-label="Site navigation">
        <button
          type="button"
          class="custom-explorer__toggle"
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
          <span class="custom-explorer__toggle-label">카테고리</span>
        </button>
        <div class="custom-explorer__folders" id={foldersId} aria-hidden="true">
          <ul class="custom-explorer__folder-list">
            {loosePages.length > 0 && (
              <li class="custom-explorer__folder-item" data-depth={0}>
                <button
                  type="button"
                  class="custom-explorer__folder"
                  data-folder-slug=""
                  data-folder-name="루트"
                >
                  <span class="custom-explorer__folder-label">루트</span>
                  <span class="custom-explorer__count">({loosePages.length})</span>
                </button>
              </li>
            )}
            {rootFolders.map((folder) => renderFolder(folder, 0))}
          </ul>
        </div>
        <div class="custom-explorer__panel" aria-hidden="true" role="dialog">
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
