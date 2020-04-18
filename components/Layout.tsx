import * as React from 'react'
import Head from 'next/head'
import Header from './header'

type Props = {
  title?: string
}

const Layout = ({
  children,
  title = 'This is the default title'
}) => (
  <>
    <Head>
      <title>{ title }</title>
    </Head>
    <style jsx global>{`
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        color: #333;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          'Helvetica Neue', Arial, Noto Sans, sans-serif, 'Apple Color Emoji',
          'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
      }
      .container {
        max-width: 65rem;
        margin: 1.5rem auto;
        padding-left: 1rem;
        padding-right: 1rem;
      }
    `}</style>
    <Header />

    <main>
      <div className="container">{children}</div>
    </main>
  </>
)

export default Layout