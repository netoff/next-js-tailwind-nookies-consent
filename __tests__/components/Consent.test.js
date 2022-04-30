import Consent, {
  DISABLED_COOKIES_NOTICE,
  DEFAULT_MESSAGE,
} from '../../src/components/Consent'

import '@testing-library/jest-dom/extend-expect'

import { cleanup, fireEvent, render } from '@testing-library/react'

describe('<Consent />', () => {
  const onAcceptCallback = jest.fn()

  const defaultConsent = {
    analytics: false,
    preference: false,
    accepted: false,
  }

  const renderConsent = (consent = defaultConsent, onAccept = onAcceptCallback) => {
    return render(<Consent consent={consent} onAccept={onAccept} />)
  }

  test('it displays Cookies panel', () => {
    const consent = renderConsent()
    expect(consent.getByText('Cookies')).toBeInTheDocument()
  })

  test('it does not open up manage panel by default', () => {
    const consent = renderConsent()
    expect(consent.queryByText('Cookies Preferences')).not.toBeInTheDocument()
  })

  test('it displays default message', () => {
    const consent = renderConsent()
    expect(consent.getByText(DEFAULT_MESSAGE)).toBeInTheDocument()
    expect(consent.queryByText(DISABLED_COOKIES_NOTICE)).not.toBeInTheDocument()
  })

  test('it opens up manage panel when Manage button is clicked', () => {
    const consent = renderConsent()
    fireEvent.click(consent.getByText('Manage'))
    expect(consent.getByText('Cookies Preferences')).toBeInTheDocument()
  })

  describe('Save button', () => {
    test('it calls the callback when button is pressed', () => {
      const onSaveCallback = jest.fn()
      const consent = renderConsent(defaultConsent, onSaveCallback)
      fireEvent.click(consent.getByText('Manage'))
      fireEvent.click(consent.getByText('Save'))

      expect(onSaveCallback.mock.calls[0][0]).toMatchObject({
        analytics: false,
        preference: false,
      })
    })

    test('it saves preference settings', () => {
      const onSaveCallback = jest.fn()
      const consent = renderConsent(defaultConsent, onSaveCallback)

      fireEvent.click(consent.getByText('Manage'))
      fireEvent.click(consent.getByLabelText('Preference Cookies'))
      fireEvent.click(consent.getByText('Save'))

      expect(onSaveCallback.mock.calls[0][0]).toMatchObject({
        analytics: false,
        preference: true,
      })
    })

    test('it saves analytics settings', () => {
      const onSaveCallback = jest.fn()
      const consent = renderConsent(defaultConsent, onSaveCallback)

      fireEvent.click(consent.getByText('Manage'))
      fireEvent.click(consent.getByLabelText('Web Analytics Cookies'))
      fireEvent.click(consent.getByText('Save'))

      expect(onSaveCallback.mock.calls[0][0]).toMatchObject({
        analytics: true,
        preference: false,
      })
    })
  })

  describe('when cookies were already accepted', () => {
    test('it displays cookies notice', () => {
      const consent = renderConsent({
        ...defaultConsent,
        accepted: true,
      })

      expect(consent.getByText(DISABLED_COOKIES_NOTICE)).toBeInTheDocument()
      expect(consent.queryByText(DEFAULT_MESSAGE)).not.toBeInTheDocument()
    })

    test("it expands manage panel when cookies are accepted(clicked on 'Accept All' or 'Save' Button)", () => {
      const consent = renderConsent({
        ...defaultConsent,
        accepted: true,
      })

      expect(consent.getByText('Cookies Preferences')).toBeInTheDocument()
    })
  })

  describe('when analytic cookies were already accepted', () => {
    test('it displays cookies notice', () => {
      const consent = renderConsent({
        ...defaultConsent,
        analytics: true,
        accepted: true,
      })

      expect(consent.getByText(DISABLED_COOKIES_NOTICE)).toBeInTheDocument()
      expect(consent.queryByText(DEFAULT_MESSAGE)).not.toBeInTheDocument()
    })

    test("it expands manage panel when cookies are accepted(clicked on 'Accept All' or 'Save' Button)", () => {
      const consent = renderConsent({
        ...defaultConsent,
        analytics: true,
        accepted: true,
      })

      expect(consent.getByText('Cookies Preferences')).toBeInTheDocument()
      expect(consent.getByLabelText('Web Analytics Cookies').checked).toBe(true)
    })
  })

  describe('when preference cookies were already accepted', () => {
    test('it displays cookies notice', () => {
      const consent = renderConsent({
        ...defaultConsent,
        preference: true,
        accepted: true,
      })

      expect(consent.getByText(DISABLED_COOKIES_NOTICE)).toBeInTheDocument()
      expect(consent.queryByText(DEFAULT_MESSAGE)).not.toBeInTheDocument()
    })

    test("it expands manage panel when cookies are accepted(clicked on 'Accept All' or 'Save' Button)", () => {
      const consent = renderConsent({
        ...defaultConsent,
        preference: true,
        accepted: true,
      })

      expect(consent.getByText('Cookies Preferences')).toBeInTheDocument()
      expect(consent.getByLabelText('Preference Cookies').checked).toBe(true)
    })
  })
})
