import { useContext, createContext } from 'react'
import Consent from './Consent'

const defaultConsent = {
  required: true,
  preference: false,
  analytics: false,
  accepted: false,
}

const ConsentContext = createContext(defaultConsent)

export function useConsent() {
  return useContext(ConsentContext)
}

export default function ConsentProvider({ consent, setConsent, children }) {
  const { required, preference, analytics, accepted } = {
    ...defaultConsent,
    ...consent,
  }

  const acceptConsent = ({ preference, analytics }, all = false) => {
    setConsent({
      ...consent,
      preference: preference || all,
      analytics: analytics || all,
      accepted: true,
    })
  }

  const allAccepted = analytics && preference

  return (
    <ConsentContext.Provider value={{ analytics, preference }}>
      {children}

      {consent && !allAccepted ? (
        <Consent consent={{ required, analytics, preference, accepted }} onAccept={acceptConsent} />
      ) : null}
    </ConsentContext.Provider>
  )
}
