import App from 'next/app'
import { createI18n, I18nProvider } from 'react-simple-i18n'
import useUser from '../lib/hooks/useUser'

const langData = {
    en: {
        nav: {
            home: 'Home',
        }
    },
    fr: {
        nav: {
            home: 'Accueil',
        }
    }
}

function MyApp({ Component, pageProps }) {
    let lang = 'en'
    const user = useUser({ redirectIfFound: false })
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