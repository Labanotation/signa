import React from 'react'
import Link from 'next/link'
import Layout from '../components/layout'
import { GetServerSideProps } from 'next'
import dotenv from 'dotenv'
import withSession from '../lib/session'
import { DbInterface, PersistentObjectUtils, Requests } from '../utils/persistent-object-utils'

const AboutPage = ({ allProps }) => (
  <Layout title="About | Next.js + TypeScript Example">
    <h1>About</h1>
    <p>This is the about page</p>
    <p>
      <Link href="/">
        <a>Go home {allProps.done} {allProps.valid}</a>
      </Link>
    </p>
    <style jsx>{`
      h1 {
        color: ${allProps.color};
      }
    `}</style>
  </Layout>
)

export const getServerSideProps: GetServerSideProps = withSession(async context => {
  dotenv.config()
  await DbInterface.init()

  const user = await PersistentObjectUtils.LoadOne(Requests.UsersByLogin, 'LePhasme')

  const valid = await user.verifyPassword(process.env.DB_PASS)

  const allProps = {
    done: user.name,
    valid: valid ? 'ok' : 'not ok',
    color: 'green'
  }
  return {
    props: {
      allProps
    }
  }
})

export default AboutPage
