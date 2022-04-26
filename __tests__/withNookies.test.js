
import '@testing-library/jest-dom/extend-expect'

import { fireEvent, render, waitFor } from '@testing-library/react'

import { useState } from 'react'

import * as nookies from 'nookies'

import withNookies, { COOKIE_DEFAULTS } from '../src/withNookies'

jest.mock('nookies')

const Component = ({ consent, children, setConsent }) => {
  const [analytics, setAnalytics] = useState(!!consent?.analytics)
  const [preference, setPreference] = useState(!!consent?.preference)

  return consent ? (
    <form>
      <input
        checked={analytics}
        type="checkbox"
        id="analytics"
        onChange={(e) => setAnalytics(e.target.checked)}
      />
      <label htmlFor="analytics">Analytics</label>

      <input
        checked={preference}
        type="checkbox"
        id="preference"
        onChange={(e) => setPreference(e.target.checked)}
      />
      <label htmlFor="preference">Preference</label>
      <input
        type="submit"
        value="Save"
        onClick={(e) => {
          e.preventDefault()
          setConsent({ analytics, preference })
        }}
      />
      <div>{children}</div>
    </form>
  ) : null
}

const ComponentWithNookies = withNookies(Component)

describe('withNookies', () => {
  it("renders component's children", async () => {
    const consent = render(
      <ComponentWithNookies>
        <div>Test</div>
      </ComponentWithNookies>
    )
    expect(await consent.findByText('Test')).toBeInTheDocument()
  })

  test('it passes Analytics cookie setting from cookies', async () => {
    nookies.parseCookies.mockImplementation(() => {
      return {
        analytics_consent: '1',
      }
    })

    const consent = render(<ComponentWithNookies />)

    waitFor(() => {
      expect(consent.getByLabelText('Analytics').checked).toBe(true)
    })

    expect(consent.getByLabelText('Preference').checked).toBe(false)
  })

  test('it passes Preferences cookie setting from cookies', async () => {
    nookies.parseCookies.mockImplementation(() => {
      return {
        preference_consent: '1',
      }
    })
    const consent = render(<ComponentWithNookies />)

    waitFor(() => {
      expect(consent.getByLabelText('Preference').checked).toBe(true)
      expect(consent.getByLabelText('Analytics').checked).toBe(false)
    })
  })

  describe('saving cookies', () => {
    let consent
    beforeEach(() => {
      nookies.parseCookies.mockImplementation(() => ({}))
      nookies.setCookie = jest.fn()
    })

    test('it writes Analytics cookie', async () => {
      const consent = render(<ComponentWithNookies />)

      fireEvent.click(await consent.findByLabelText('Analytics'))
      fireEvent.click(await consent.findByText('Save'))

      expect(nookies.setCookie.mock.calls[0][0]).toEqual(null)
      expect(nookies.setCookie.mock.calls[0][1]).toEqual('analytics_consent')
      expect(nookies.setCookie.mock.calls[0][2]).toEqual('1')
      expect(nookies.setCookie.mock.calls[0][3]).toEqual(COOKIE_DEFAULTS)
    })

    test('it writes Preference cookie', async () => {
      const consent = render(<ComponentWithNookies />)

      fireEvent.click(await consent.findByLabelText('Preference'))
      fireEvent.click(await consent.findByText('Save'))

      expect(nookies.setCookie.mock.calls[0][0]).toEqual(null)
      expect(nookies.setCookie.mock.calls[0][1]).toEqual('preference_consent')
      expect(nookies.setCookie.mock.calls[0][2]).toEqual('1')
      expect(nookies.setCookie.mock.calls[0][3]).toEqual(COOKIE_DEFAULTS)
    })
  })
})
