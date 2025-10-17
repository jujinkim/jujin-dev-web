import { ContentDetails } from "../../quartz/plugins/emitters/contentIndex"
import { FullSlug, resolveRelative } from "../../quartz/util/path"

type ExplorerElements = {
  root: HTMLElement
  folders: HTMLElement
  panel: HTMLElement
  overlay: HTMLElement
  list: HTMLUListElement
  title: HTMLElement
  back: HTMLButtonElement
  toggle: HTMLButtonElement | null
  navClose: HTMLButtonElement | null
}

type FolderButton = HTMLButtonElement & {
  dataset: DOMStringMap & {
    folderSlug: string
    folderName: string
  }
}

let explorerElements: ExplorerElements | null = null
let panelOpen = false
let navOpen = false
let historyStateActive = false
let activeButton: FolderButton | null = null
let currentSlug: FullSlug

const PANEL_HISTORY_STATE = { explorerPanel: true }
const mobileMediaQuery = window.matchMedia("(max-width: 768px)")

const isMobile = () => mobileMediaQuery.matches

const syncOverlay = () => {
  if (!explorerElements) return
  const { overlay } = explorerElements
  const mobile = isMobile()
  const shouldShow = mobile ? (panelOpen || navOpen) : panelOpen
  overlay.setAttribute("aria-hidden", shouldShow ? "false" : "true")
  overlay.style.opacity = shouldShow ? "1" : "0"
  overlay.style.pointerEvents = shouldShow ? "auto" : "none"
}

const clearActiveButton = () => {
  if (activeButton) {
    activeButton.classList.remove("is-active")
    activeButton = null
  }
}

const setNavState = (open: boolean) => {
  if (!explorerElements) return
  const { root, folders, toggle } = explorerElements
  navOpen = open
  const mobile = isMobile()
  root.classList.toggle("is-nav-open", open && mobile)

  if (mobile) {
    folders.setAttribute("aria-hidden", open ? "false" : "true")
  } else {
    folders.setAttribute("aria-hidden", "false")
  }

  if (toggle) {
    toggle.setAttribute("aria-expanded", open ? "true" : "false")
  }
  syncOverlay()
}

const closeNav = () => setNavState(false)
const openNav = () => setNavState(true)

const closePanelDom = () => {
  if (!explorerElements) return
  const { root, panel } = explorerElements
  root.classList.remove("is-panel-open")
  panel.setAttribute("aria-hidden", "true")
  panelOpen = false
  historyStateActive = false
  clearActiveButton()
  syncOverlay()
}

const formatFolderSlug = (slug: string): string => slug.replace(/\/index$/, "")

const buildListItems = (
  data: Record<string, ContentDetails>,
  folderSlug: string,
): HTMLLIElement[] => {
  const normalized = formatFolderSlug(folderSlug)

  const items = Object.values(data)
    .filter((item) => {
      const itemSlug = item.slug
      if (!itemSlug) return false
      if (itemSlug.endsWith("/index")) return false
      if (normalized === "") {
        return !itemSlug.includes("/")
      }
      return itemSlug.startsWith(normalized)
    })
    .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }))

  if (items.length === 0) {
    const emptyState = document.createElement("li")
    emptyState.className = "custom-explorer__panel-empty"
    emptyState.textContent = "글이 없습니다."
    return [emptyState]
  }

  return items.map((item) => {
    const li = document.createElement("li")
    li.className = "custom-explorer__panel-item"

    const link = document.createElement("a")
    link.href = resolveRelative(currentSlug, item.slug as FullSlug)
    link.textContent = item.title
    link.className = "custom-explorer__panel-link"

    li.appendChild(link)
    return li
  })
}

const openPanel = async (button: FolderButton) => {
  if (!explorerElements) return
  const { root, panel, list, title } = explorerElements

  const data = await fetchData
  list.innerHTML = ""

  const items = buildListItems(data, button.dataset.folderSlug)
  for (const item of items) {
    list.appendChild(item)
  }

  title.textContent = button.dataset.folderName ?? ""

  if (activeButton && activeButton !== button) {
    activeButton.classList.remove("is-active")
  }
  button.classList.add("is-active")
  activeButton = button

  root.classList.add("is-panel-open")
  panel.setAttribute("aria-hidden", "false")
  panelOpen = true

  if (isMobile() && !historyStateActive) {
    history.pushState(PANEL_HISTORY_STATE, "", window.location.href)
    historyStateActive = true
  }

  syncOverlay()
}

const handlePopState = (event: PopStateEvent) => {
  if (!panelOpen) return
  historyStateActive = false
  closePanelDom()
}

const setupExplorer = (slug: FullSlug) => {
  currentSlug = slug

  const root = document.querySelector<HTMLElement>(".custom-explorer")
  if (!root) {
    explorerElements = null
    return
  }

  const folders = root.querySelector<HTMLElement>(".custom-explorer__folders")
  const panel = root.querySelector<HTMLElement>(".custom-explorer__panel")
  const overlay = root.querySelector<HTMLElement>(".custom-explorer__overlay")
  const list = root.querySelector<HTMLUListElement>(".custom-explorer__panel-list")
  const title = root.querySelector<HTMLElement>(".custom-explorer__panel-title")
  const back = root.querySelector<HTMLButtonElement>(".custom-explorer__back")
  const toggle = root.querySelector<HTMLButtonElement>(".custom-explorer__toggle")
  const navClose = root.querySelector<HTMLButtonElement>(".custom-explorer__nav-close")

  if (!folders || !panel || !overlay || !list || !title || !back) {
    explorerElements = null
    return
  }

  explorerElements = { root, folders, panel, overlay, list, title, back, toggle, navClose }
  panelOpen = false
  navOpen = false
  historyStateActive = false
  clearActiveButton()
  root.classList.remove("is-panel-open")
  root.classList.remove("is-nav-open")
  panel.setAttribute("aria-hidden", "true")

  const mobile = isMobile()
  if (mobile) {
    folders.setAttribute("aria-hidden", "true")
  } else {
    folders.setAttribute("aria-hidden", "false")
  }

  closePanelDom()

  // 폴더 버튼들
  const buttons = root.querySelectorAll<HTMLButtonElement>("[data-folder-slug]")
  buttons.forEach((button) => {
    const handler = (evt: Event) => {
      evt.preventDefault()
      openPanel(button as FolderButton).catch(console.error)
    }
    button.removeEventListener("click", handler)
    button.addEventListener("click", handler)
  })

  // 뒤로 버튼
  const backHandler = (evt: Event) => {
    evt.preventDefault()
    if (isMobile() && historyStateActive) {
      historyStateActive = false
      history.back()
    } else {
      closePanelDom()
      historyStateActive = false
    }
    if (isMobile()) {
      setTimeout(() => {
        if (!navOpen) openNav()
      }, 50)
    }
  }
  back.removeEventListener("click", backHandler)
  back.addEventListener("click", backHandler)

  // 오버레이
  const overlayHandler = (evt: Event) => {
    evt.preventDefault()
    if (panelOpen) {
      if (isMobile() && historyStateActive) {
        historyStateActive = false
        history.back()
      } else {
        closePanelDom()
        historyStateActive = false
      }
    } else if (navOpen) {
      closeNav()
    }
  }
  overlay.removeEventListener("click", overlayHandler)
  overlay.addEventListener("click", overlayHandler)

  // 햄버거 토글
  if (toggle) {
    toggle.classList.remove("hide-until-loaded")
    const toggleHandler = (evt: Event) => {
      evt.preventDefault()
      if (navOpen) {
        closeNav()
      } else {
        openNav()
      }
    }
    toggle.removeEventListener("click", toggleHandler)
    toggle.addEventListener("click", toggleHandler)
  }

  // X 닫기 버튼
  if (navClose) {
    const navCloseHandler = (evt: Event) => {
      evt.preventDefault()
      closeNav()
    }
    navClose.removeEventListener("click", navCloseHandler)
    navClose.addEventListener("click", navCloseHandler)
  }
}

const onPrenav = () => {
  if (panelOpen) {
    closePanelDom()
  }
  if (navOpen && isMobile()) {
    closeNav()
  }
}

window.addEventListener("popstate", handlePopState)
document.addEventListener("prenav", onPrenav)

document.addEventListener("nav", (event: CustomEventMap["nav"]) => {
  setupExplorer(event.detail.url)
})

document.addEventListener("DOMContentLoaded", () => {
  setupExplorer((document.body.dataset.slug ?? "index") as FullSlug)
})
