const COOKIE_NAME = "jujin_language_preference"
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365

export const readPreferredLanguage = (): string | null => {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim())
  for (const cookie of cookies) {
    if (!cookie) continue
    const [name, ...rest] = cookie.split("=")
    if (name === COOKIE_NAME) {
      return decodeURIComponent(rest.join("="))
    }
  }
  return null
}

export const writePreferredLanguage = (lang: string) => {
  const expires = new Date(Date.now() + COOKIE_MAX_AGE_SECONDS * 1000).toUTCString()
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(lang)}; path=/; SameSite=Lax; Expires=${expires}`
}
