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

  // 직접 자식 파일만 필터링 (하위 폴더의 파일 제외)
  const directChildren = Object.values(data)
    .filter((item) => {
      const itemSlug = item.slug
      if (!itemSlug) return false
      if (itemSlug.endsWith("/index")) return false

      if (normalized === "") {
        // 루트: 슬래시가 없는 것만
        return !itemSlug.includes("/")
      }

      // 폴더 내부: prefix 확인 후 추가 슬래시가 없는지 확인
      if (!itemSlug.startsWith(normalized + "/")) return false
      const remainder = itemSlug.substring(normalized.length + 1)
      return !remainder.includes("/")
    })
    .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }))

  // 하위 폴더 정보 수집
  const subfolderInfo = new Map<string, number>()
  Object.values(data).forEach((item) => {
    const itemSlug = item.slug
    if (!itemSlug || itemSlug.endsWith("/index")) return

    let prefix: string
    if (normalized === "") {
      // 루트의 경우
      if (!itemSlug.includes("/")) return
      prefix = itemSlug.split("/")[0]
    } else {
      // 특정 폴더의 경우
      if (!itemSlug.startsWith(normalized + "/")) return
      const remainder = itemSlug.substring(normalized.length + 1)
      if (!remainder.includes("/")) return // 직접 자식은 제외
      prefix = normalized + "/" + remainder.split("/")[0]
    }

    subfolderInfo.set(prefix, (subfolderInfo.get(prefix) || 0) + 1)
  })

  const result: HTMLLIElement[] = []

  // 직접 자식 파일들
  directChildren.forEach((item) => {
    const li = document.createElement("li")
    li.className = "custom-explorer__panel-item"

    const link = document.createElement("a")
    link.href = resolveRelative(currentSlug, item.slug as FullSlug)
    link.textContent = item.title
    link.className = "custom-explorer__panel-link"

    li.appendChild(link)
    result.push(li)
  })

  // 하위 폴더 정보
  if (subfolderInfo.size > 0) {
    const sortedSubfolders = Array.from(subfolderInfo.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))

    sortedSubfolders.forEach(([folderPath, count]) => {
      const folderName = folderPath.split("/").pop() || folderPath
      const li = document.createElement("li")
      li.className = "custom-explorer__subfolder-info"
      li.textContent = `${folderName}에 ${count}개의 글`
      result.push(li)
    })
  }

  if (result.length === 0) {
    const emptyState = document.createElement("li")
    emptyState.className = "custom-explorer__panel-empty"
    emptyState.textContent = "글이 없습니다."
    return [emptyState]
  }

  return result
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

  // 폴더 버튼들 - 클론하여 리스너 제거
  const buttons = root.querySelectorAll<HTMLButtonElement>("[data-folder-slug]")
  buttons.forEach((button) => {
    const newButton = button.cloneNode(true) as HTMLButtonElement
    button.replaceWith(newButton)
    newButton.addEventListener("click", (evt: Event) => {
      evt.preventDefault()
      openPanel(newButton as FolderButton).catch(console.error)
    })
  })

  // 뒤로 버튼 - 클론하여 리스너 제거
  const newBack = back.cloneNode(true) as HTMLButtonElement
  back.replaceWith(newBack)
  explorerElements.back = newBack
  newBack.addEventListener("click", (evt: Event) => {
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
  })

  // 오버레이 - 클론하여 리스너 제거
  const newOverlay = overlay.cloneNode(true) as HTMLElement
  overlay.replaceWith(newOverlay)
  explorerElements.overlay = newOverlay
  newOverlay.addEventListener("click", (evt: Event) => {
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
  })

  // 햄버거 토글 - 클론하여 리스너 제거
  if (toggle) {
    toggle.classList.remove("hide-until-loaded")
    const newToggle = toggle.cloneNode(true) as HTMLButtonElement
    newToggle.classList.remove("hide-until-loaded")
    toggle.replaceWith(newToggle)
    explorerElements.toggle = newToggle
    newToggle.addEventListener("click", (evt: Event) => {
      evt.preventDefault()
      if (navOpen) {
        closeNav()
      } else {
        openNav()
      }
    })
  }

  // X 닫기 버튼 - 클론하여 리스너 제거
  if (navClose) {
    const newNavClose = navClose.cloneNode(true) as HTMLButtonElement
    navClose.replaceWith(newNavClose)
    explorerElements.navClose = newNavClose
    newNavClose.addEventListener("click", (evt: Event) => {
      evt.preventDefault()
      closeNav()
    })
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
