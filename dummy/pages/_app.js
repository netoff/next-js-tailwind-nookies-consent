import '../styles/globals.css'

import React from 'react'

const ConsentProviderWithCookies = require('../../dist/index.modern').default

function MyApp({ Component, pageProps }) {
  return <ConsentProviderWithCookies>
    <Component {...pageProps} />
  </ConsentProviderWithCookies>
}

export default MyApp
