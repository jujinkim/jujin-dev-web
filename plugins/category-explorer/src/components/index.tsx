import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types"

type Folder = {
  name: string
  slug: string
  children: Folder[]
}

const languageSuffix = /\.(?:ko|en|ja|zh)$/

function isPublishedOriginal(file: QuartzComponentProps["allFiles"][number]): boolean {
  const slug = typeof file.slug === "string" ? file.slug : ""
  const publish = file.frontmatter?.publish
  const isPublished = publish === true || publish === "true"
  const basename = slug.split("/").at(-1) ?? ""
  return isPublished && slug !== "404" && !languageSuffix.test(basename)
}

function createFolders(files: QuartzComponentProps["allFiles"]): Folder[] {
  const root: Folder = { name: "", slug: "", children: [] }
  for (const file of files.filter(isPublishedOriginal)) {
    const slug = file.slug as string
    const segments = slug.split("/").slice(0, -1)
    let current = root
    for (const segment of segments) {
      let folder = current.children.find((candidate) => candidate.name === segment)
      if (!folder) {
        const prefix = current.slug ? `${current.slug}/` : ""
        folder = { name: segment, slug: `${prefix}${segment}`, children: [] }
        current.children.push(folder)
      }
      current = folder
    }
  }
  const sortFolders = (folders: Folder[]) => {
    folders.sort((left, right) => left.name.localeCompare(right.name, "ko"))
    folders.forEach((folder) => sortFolders(folder.children))
  }
  sortFolders(root.children)
  return root.children
}

function countDescendants(slug: string, files: QuartzComponentProps["allFiles"]): number {
  return files.filter((file) => {
    if (!isPublishedOriginal(file)) return false
    const fileSlug = file.slug as string
    return slug === "" ? !fileSlug.includes("/") : fileSlug.startsWith(`${slug}/`)
  }).length
}

function renderFolder(folder: Folder, files: QuartzComponentProps["allFiles"], depth = 0) {
  return (
    <li class="category-explorer__folder-item" style={{ "--depth": `${depth}` }}>
      <button
        type="button"
        class="category-explorer__folder"
        data-category-slug={folder.slug}
        data-category-name={folder.name}
      >
        <span>{folder.name}</span>
        <span class="category-explorer__count">({countDescendants(folder.slug, files)})</span>
      </button>
      {folder.children.length > 0 && (
        <ul class="category-explorer__folder-list">
          {folder.children.map((child) => renderFolder(child, files, depth + 1))}
        </ul>
      )}
    </li>
  )
}

const style = `
.category-explorer { position: relative; padding: .25rem 0; }
.category-explorer__folder-list, .category-explorer__panel-list { list-style: none; margin: 0; padding: 0; }
.category-explorer__folder-list { display: flex; flex-direction: column; gap: .25rem; }
.category-explorer__toggle { background: transparent; border: 0; border-radius: .5rem; color: var(--dark); cursor: pointer; display: none; font-size: 1.25rem; margin: 0 0 .25rem; padding: .35rem .5rem; }
.category-explorer__toggle:hover, .category-explorer__toggle:focus-visible { background: var(--highlight); color: var(--secondary); }
.category-explorer__folder-item { margin: 0; }
.category-explorer__folder { align-items: baseline; background: transparent; border: 0; border-radius: .5rem; color: inherit; cursor: pointer; display: flex; gap: .5rem; justify-content: space-between; padding: .4rem .5rem; padding-left: calc(.5rem + var(--depth, 0) * 1rem); text-align: left; width: 100%; }
.category-explorer__folder:hover, .category-explorer__folder:focus-visible, .category-explorer__folder.is-active { background: var(--highlight); color: var(--secondary); }
.category-explorer__count { color: var(--gray); font-size: .8rem; }
.category-explorer__panel { background: var(--light); border: 1px solid var(--lightgray); border-radius: .75rem; box-shadow: 0 18px 30px rgb(0 0 0 / .1); display: none; left: calc(100% + 1rem); max-height: min(34rem, 75vh); min-width: min(22rem, 28vw); position: absolute; top: 0; z-index: 12; }
.category-explorer.is-open .category-explorer__panel { display: block; }
.category-explorer__panel-header { align-items: center; border-bottom: 1px solid var(--lightgray); display: flex; gap: .75rem; padding: .75rem 1rem; }
.category-explorer__panel-title { font-size: 1.05rem; margin: 0; }
.category-explorer__back { background: transparent; border: 0; border-radius: .4rem; color: inherit; cursor: pointer; font-size: 1.1rem; padding: .25rem .5rem; }
.category-explorer__panel-list { display: flex; flex-direction: column; gap: .4rem; max-height: min(28rem, 65vh); overflow-y: auto; padding: .75rem 1rem 1.5rem; }
.category-explorer__panel-link { border-radius: .4rem; color: inherit; display: block; padding: .4rem .25rem; text-decoration: none; }
.category-explorer__panel-link:hover, .category-explorer__panel-link:focus-visible { background: var(--highlight); color: var(--secondary); }
.category-explorer__empty, .category-explorer__nested { color: var(--gray); font-size: .9rem; }
@media (max-width: 768px) { .category-explorer__toggle { display: block; } .category-explorer__root-list { background: var(--light); box-shadow: 12px 0 24px rgb(0 0 0 / .18); height: 100vh; left: 0; overflow-y: auto; padding: 1rem; position: fixed; top: 0; transform: translateX(-110%); transition: transform .2s ease; width: min(85vw, 18rem); z-index: 12; } .category-explorer.is-nav-open .category-explorer__root-list { transform: translateX(0); } .category-explorer__panel { inset: 0 auto auto 0; max-height: 100vh; min-height: 100vh; min-width: min(90vw, 22rem); position: fixed; } .category-explorer__panel-list { max-height: calc(100vh - 4rem); } }
`

const clientScript = `
const categoryExplorerSetup = () => {
  const root = document.querySelector(".category-explorer")
  if (!root) return
  if (root.dataset.categoryExplorerInitialized === "true") return
  root.dataset.categoryExplorerInitialized = "true"
  const panel = root.querySelector(".category-explorer__panel")
  const title = root.querySelector(".category-explorer__panel-title")
  const list = root.querySelector(".category-explorer__panel-list")
  const back = root.querySelector(".category-explorer__back")
  if (!panel || !title || !list || !back) return
  const basePath = document.body.dataset.basepath || ""
  const indexUrl = new URL(basePath + "/static/contentIndex.json", window.location.origin)
  const open = async (button) => {
    const data = await fetch(indexUrl).then((response) => response.ok ? response.json() : {})
    const folder = button.dataset.categorySlug || ""
    const direct = Object.values(data).filter((entry) => {
      const slug = entry.slug || ""
      const name = slug.split("/").pop() || ""
      if (name.includes(".") || slug.endsWith("/index")) return false
      if (!folder) return !slug.includes("/")
      if (!slug.startsWith(folder + "/")) return false
      return !slug.slice(folder.length + 1).includes("/")
    }).sort((left, right) => left.title.localeCompare(right.title, undefined, { sensitivity: "base" }))
    list.replaceChildren()
    for (const entry of direct) {
      const item = document.createElement("li")
      const link = document.createElement("a")
      link.className = "category-explorer__panel-link"
      link.href = new URL(basePath + "/" + entry.slug, window.location.origin).pathname
      link.textContent = entry.title
      item.append(link)
      list.append(item)
    }
    if (!direct.length) {
      const item = document.createElement("li")
      item.className = "category-explorer__empty"
      item.textContent = "글이 없습니다."
      list.append(item)
    }
    title.textContent = button.dataset.categoryName || "루트"
    root.querySelectorAll(".category-explorer__folder.is-active").forEach((item) => item.classList.remove("is-active"))
    button.classList.add("is-active")
    root.classList.remove("is-nav-open")
    root.classList.add("is-open")
    panel.setAttribute("aria-hidden", "false")
  }
  root.querySelectorAll("[data-category-slug]").forEach((button) => {
    button.addEventListener("click", () => open(button).catch(console.error))
  })
  root.querySelector(".category-explorer__toggle")?.addEventListener("click", () =>
    root.classList.toggle("is-nav-open"),
  )
  back.addEventListener("click", () => {
    root.classList.remove("is-open")
    root.classList.add("is-nav-open")
    panel.setAttribute("aria-hidden", "true")
  })
}
document.addEventListener("nav", categoryExplorerSetup)
document.addEventListener("prenav", () => document.querySelector(".category-explorer")?.classList.remove("is-open", "is-nav-open"))
`

export const CategoryExplorer: QuartzComponentConstructor = () => {
  const Component: QuartzComponent = ({ allFiles, displayClass }) => {
    const folders = createFolders(allFiles)
    const loosePageCount = countDescendants("", allFiles)
    if (folders.length === 0 && loosePageCount === 0) return null
    return (
      <nav class={`category-explorer ${displayClass ?? ""}`} aria-label="카테고리 탐색">
        <button type="button" class="category-explorer__toggle" aria-label="카테고리 메뉴">
          ☰
        </button>
        <ul class="category-explorer__folder-list category-explorer__root-list">
          {loosePageCount > 0 && (
            <li class="category-explorer__folder-item">
              <button
                type="button"
                class="category-explorer__folder"
                data-category-slug=""
                data-category-name="루트"
              >
                <span>루트</span>
                <span class="category-explorer__count">({loosePageCount})</span>
              </button>
            </li>
          )}
          {folders.map((folder) => renderFolder(folder, allFiles))}
        </ul>
        <section class="category-explorer__panel" aria-hidden="true" role="dialog">
          <div class="category-explorer__panel-header">
            <button type="button" class="category-explorer__back" aria-label="뒤로">
              ←
            </button>
            <h3 class="category-explorer__panel-title"></h3>
          </div>
          <ul class="category-explorer__panel-list"></ul>
        </section>
      </nav>
    )
  }
  Component.css = style
  Component.afterDOMLoaded = clientScript
  return Component
}
