import App from 'next/app'
import { createI18n, I18nProvider } from 'react-simple-i18n'
import useUser from '../lib/hooks/useUser'
import langData from '../i18n.json'

function MyApp({ Component, pageProps }) {
    const user = useUser({ redirectIfFound: false })
    let lang = 'en'
    if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
        const detectBrowserLanguage = require('detect-browser-language')
        const userLanguage = detectBrowserLanguage()
        for (let langDataKey in langData) {
            if (userLanguage.indexOf(langDataKey) === 0) {
                lang = langDataKey
            }
        }
    }
    if (user && user.lang) {
        lang = user.lang
    }
    return <I18nProvider i18n={createI18n(langData, { lang: lang })}>
        <Component {...pageProps} />
    </I18nProvider>
}

MyApp.getInitialProps = async (appContext) => {
    const appProps = await App.getInitialProps(appContext)
    return { ...appProps }
}

export default MyApp