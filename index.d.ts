declare module "*.scss" {
  const content: string
  export = content
}

declare module "*.inline.ts" {
  const content: string
  export default content
}

declare module "*.inline" {
  const content: string
  export default content
}

// dom custom event
interface CustomEventMap {
  prenav: CustomEvent<{}>
  nav: CustomEvent<{ url: FullSlug }>
  themechange: CustomEvent<{ theme: "light" | "dark" }>
  readermodechange: CustomEvent<{ mode: "on" | "off" }>
}

type ContentIndex = Record<FullSlug, ContentDetails>
declare const fetchData: Promise<ContentIndex>
