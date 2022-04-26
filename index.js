import ConsentProvider from './src/ConsentProvider'
import withNookies from './src/withNookies'

export { default as ConsentProviderWithoutCookies, useConsent } from './src/ConsentProvider'

const ConsentProviderWithCookies = withNookies(ConsentProvider)

export default ConsentProviderWithCookies
