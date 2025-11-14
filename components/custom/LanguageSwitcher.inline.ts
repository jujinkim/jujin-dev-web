import { writePreferredLanguage } from "./languagePreference"

const handleClick = (event: MouseEvent) => {
  const target = event.target
  if (!(target instanceof Element)) {
    return
  }

  const link = target.closest<HTMLAnchorElement>(".language-switcher__link[data-lang-code]")
  if (!link) {
    return
  }

  const lang = link.dataset.langCode
  if (!lang) {
    return
  }

  writePreferredLanguage(lang)
}

document.addEventListener("click", handleClick)
