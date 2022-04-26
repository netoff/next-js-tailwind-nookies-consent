import { parseCookies, setCookie, destroyCookie } from 'nookies'
import { useState, useEffect } from 'react'

const MAX_COOKIE_AGE = 365 * 30 * 24 * 60 * 60

export const COOKIE_DEFAULTS = {
  maxAge: MAX_COOKIE_AGE,
  path: '/',
}

export default function withNookies(Component) {
  const PREFERENCE_COOKIE = 'preference_consent'
  const ANALYTICS_COOKIE = 'analytics_consent'
  const COOKIES_ACCEPTED = 'consent_accepted'

  return function ComponentWithNookies({ children }) {
    const [consent, setConsent] = useState(null)

    const onAcceptConsent = ({ preference, analytics }) => {
      setConsent({ preference, analytics, accepted: true })

      preference
        ? setCookie(null, PREFERENCE_COOKIE, '1', COOKIE_DEFAULTS)
        : destroyCookie(null, PREFERENCE_COOKIE)
      analytics
        ? setCookie(null, ANALYTICS_COOKIE, '1', COOKIE_DEFAULTS)
        : destroyCookie(null, ANALYTICS_COOKIE)

      setCookie(null, COOKIES_ACCEPTED, '1', COOKIES_ACCEPTED)
    }

    useEffect(() => {
      const cookies = parseCookies()
      const isSet = (cookie) => cookies && parseInt(cookies[cookie]) == 1

      setConsent((prev) => ({
        ...prev,
        preference: isSet(PREFERENCE_COOKIE),
        analytics: isSet(ANALYTICS_COOKIE),
        accepted: isSet(COOKIES_ACCEPTED),
      }))
    }, [])

    return (
      <Component consent={consent} setConsent={onAcceptConsent}>
        {children}
      </Component>
    )
  }
}
