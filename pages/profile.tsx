import React from 'react'
import Layout from '../components/layout'
import withSession from '../lib/session'
import { PersistentObjectUtils } from '../utils/persistent-object-utils'
import { User } from '../interfaces/user'
import { useI18n } from 'react-simple-i18n'

const SsrProfile = ({ user }) => {
  const { t } = useI18n()
  return (
    <Layout>
      <h1>Your profile</h1>
      <p>{t('nav.home')}</p>
      <h2>
        This page uses{' '}
        <a href="https://nextjs.org/docs/basic-features/pages#server-side-rendering">
          Server-side Rendering (SSR)
        </a>{' '}
        and{' '}
        <a href="https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering">
          getServerSideProps
        </a>
      </h2>
      {user?._id && (
        <>
          <pre>{JSON.stringify(user, undefined, 2)}</pre>
        </>
      )}
    </Layout>
  )
}

export const getServerSideProps = withSession(async function ({ req, res }) {
  const dehydratedUser = req.session.get('user')
  if (dehydratedUser !== undefined) {
    const user = PersistentObjectUtils.Rehydrate(dehydratedUser)
    if (user instanceof User === true) {
      return {
        props: { user: dehydratedUser }
      }
    }
  }
  res.setHeader('location', '/login')
  res.statusCode = 302
  res.end()
  return {
    props: { user: {} }
  }
})

export default SsrProfile