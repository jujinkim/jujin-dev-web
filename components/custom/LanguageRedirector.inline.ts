import { readPreferredLanguage, writePreferredLanguage } from "./languagePreference"

type VariantEntry = {
  code: string
  href: string
}

type LanguagePayload = {
  currentLang: string | null
  isTranslated: boolean
  variants: VariantEntry[]
}

const parsePayload = (): LanguagePayload | null => {
  const container = document.querySelector<HTMLDivElement>("[data-language-preference]")
  if (!container) {
    return null
  }

  const raw = container.dataset.languagePreference
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as LanguagePayload
  } catch (error) {
    console.error("[language-redirector] failed to parse payload", error)
    return null
  }
}

const shouldRedirect = (payload: LanguagePayload, preferred: string): URL | null => {
  if (!preferred) {
    return null
  }

  if (payload.currentLang === preferred) {
    return null
  }

  if (!payload.variants.length) {
    return null
  }

  const target = payload.variants.find((variant) => variant.code === preferred)
  if (!target || !target.href) {
    return null
  }

  const targetUrl = new URL(target.href, window.location.href)
  if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search) {
    return null
  }

  return targetUrl
}

const runPreference = () => {
  const payload = parsePayload()
  if (!payload) {
    return
  }

  const preferredLang = readPreferredLanguage()
  const candidate = preferredLang ? shouldRedirect(payload, preferredLang) : null
  if (candidate) {
    window.location.assign(candidate.toString())
    return
  }

  if (payload.isTranslated && payload.currentLang) {
    writePreferredLanguage(payload.currentLang)
  }
}

runPreference()
document.addEventListener("nav", runPreference)
