import ConsentProviderWithoutCookies, {useConsent} from '../../src/components/ConsentProvider'
import { fireEvent, render, screen } from '@testing-library/react'

import '@testing-library/jest-dom/extend-expect'

describe('<ConsentProviderWithoutCookies />', () => {
  const renderConsentProvider = (consent = null, onAcceptConsent = jest.fn()) => {
    return render(<ConsentProviderWithoutCookies consent={consent} setConsent={onAcceptConsent} />)
  }

  test('it does not render if all is accepted', () => {
    renderConsentProvider({ preference: true, analytics: true })
    expect(screen.queryByText('Cookies')).not.toBeInTheDocument()
  })

  test('it does not render if no data is loaded', () => {
    renderConsentProvider()
    expect(screen.queryByText('Cookies')).not.toBeInTheDocument()
  })

  test('it renders if none is allowed', () => {
    renderConsentProvider({})
    expect(screen.getByText('Cookies')).toBeInTheDocument()
  })

  test('it renders if only preference cookies are allowed', () => {
    renderConsentProvider({ preference: true })
    expect(screen.getByText('Cookies')).toBeInTheDocument()
  })

  test('it renders if only analytics cookies are allowed', () => {
    renderConsentProvider({ analytics: true })
    expect(screen.getByText('Cookies')).toBeInTheDocument()
  })

  test('it sets both values when all is accepted', () => {
    const onAcceptConsent = jest.fn()
    const consentProvider = renderConsentProvider({}, onAcceptConsent)
    const button = consentProvider.getByText('Accept All')

    fireEvent.click(button)

    expect(onAcceptConsent.mock.calls[0][0].analytics).toBe(true)
    expect(onAcceptConsent.mock.calls[0][0].preference).toBe(true)
  })

  describe('preferences are open', () => {
    let onAcceptConsent, consentProvider

    beforeEach(() => {
      onAcceptConsent = jest.fn()
      consentProvider = renderConsentProvider({}, onAcceptConsent)
      fireEvent.click(consentProvider.getByText('Manage'))
    })

    test('it displays preferences', () => {
      expect(consentProvider.getByText('Cookies Preferences')).toBeInTheDocument()

      expect(consentProvider.getByLabelText('Required Cookies').checked).toBe(true)
      expect(consentProvider.getByLabelText('Preference Cookies').checked).toBe(false)
      expect(consentProvider.getByLabelText('Web Analytics Cookies').checked).toBe(false)
    })

    describe('only Analytics is accepted', () => {
      beforeEach(() => {
        fireEvent.click(consentProvider.getByLabelText('Web Analytics Cookies'))
        fireEvent.click(consentProvider.getByText('Save'))
      })

      test('checkbox for Analytics should be checked', () => {
        expect(consentProvider.getByLabelText('Web Analytics Cookies').checked).toBe(true)
      })

      test('it sets proper values', () => {
        expect(onAcceptConsent.mock.calls[0][0].analytics).toBe(true)
        expect(onAcceptConsent.mock.calls[0][0].preference).toBe(false)
      })
    })

    describe('only Preference value accepted', () => {
      beforeEach(() => {
        fireEvent.click(screen.getByLabelText('Preference Cookies'))
        fireEvent.click(screen.getByText('Save'))
      })

      test('checkbox for Preference should be checked', () => {
        expect(consentProvider.getByLabelText('Preference Cookies').checked).toBe(true)
      })

      test('it sets proper values', () => {
        expect(onAcceptConsent.mock.calls[0][0].analytics).toBe(false)
        expect(onAcceptConsent.mock.calls[0][0].preference).toBe(true)
      })
    })
  })

  describe('useConsent', () => {
    const renderConsentProvider = ({ analytics, preference }) => {
      const ChildComponent = () => {
        const consent = useConsent()

        return (
          <>
            {consent.analytics ? <div data-testid="analytics">Analytics</div> : null}
            {consent.preference ? <div data-testid="preference">Preference</div> : null}
          </>
        )
      }

      return render(
        <ConsentProviderWithoutCookies consent={{ analytics, preference }} setConsent={jest.fn()}>
          <ChildComponent />
        </ConsentProviderWithoutCookies>
      )
    }

    test('it provides child component with analytics setting', () => {
      const consent = renderConsentProvider({ analytics: true, preference: false })
      expect(consent.getByTestId('analytics')).toBeInTheDocument()
      expect(consent.queryByTestId('preference')).not.toBeInTheDocument()
    })

    test('it provides child component with preference setting', () => {
      const consent = renderConsentProvider({ analytics: false, preference: true })
      expect(consent.queryByTestId('analytics')).not.toBeInTheDocument()
      expect(consent.getByTestId('preference')).toBeInTheDocument()
    })

    test('it provides child component with preference and analytics setting', () => {
      const consent = renderConsentProvider({ analytics: true, preference: true })
      expect(consent.getByTestId('analytics')).toBeInTheDocument()
      expect(consent.getByTestId('preference')).toBeInTheDocument()
    })
  })
})
