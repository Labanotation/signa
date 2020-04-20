import * as React from 'react'
import Head from 'next/head'
import Header from './header'
import Footer from './footer'

type Props = {
  title?: string
}

const Layout = ({
  children,
  title = 'Signa'
}) => (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <style jsx global>{`
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }
      html,
      body {
        padding: 0;
        margin: 0;
        color: #333;
        height: 100%;
        width: 100%;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          'Helvetica Neue', Arial, Noto Sans, sans-serif, 'Apple Color Emoji',
          'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
      }
      .container {
        padding: 0 0.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      main {
        padding: 2rem 0;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      a {
        color: inherit;
        text-decoration: none;
      }
    `}</style>
      <Header />
      <main>
        <div className="container">{children}</div>
      </main>
      <Footer />
    </>
  )

export default Layout