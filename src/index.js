import React, { useState, useEffect } from 'react'

import { parseCookies, setCookie, destroyCookie } from 'nookies'

import ConsentProviderWithoutCookies from './components/ConsentProvider'

// export { useConsent } from './components/ConsentProvider'

const PREFERENCE_COOKIE = 'preference_consent'
const ANALYTICS_COOKIE = 'analytics_consent'
const COOKIES_ACCEPTED = 'consent_accepted'
const MAX_COOKIE_AGE = 365 * 30 * 24 * 60 * 60

export const COOKIE_DEFAULTS = {
  maxAge: MAX_COOKIE_AGE,
  path: '/',
}

export default function ConsentProviderWithCookies(props) {
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

  return <ConsentProviderWithoutCookies consent={consent} setConsent={onAcceptConsent}>
      {props.children}
  </ConsentProviderWithoutCookies>
}