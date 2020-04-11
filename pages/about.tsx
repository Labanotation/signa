import React from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import { GetServerSideProps } from 'next'
import dotenv from 'dotenv';
import { DbInterface, PersistentObjectUtils, Requests } from '../utils/persistent-object-utils';

const AboutPage = ({ allProps }) => (
  <Layout title="About | Next.js + TypeScript Example">
    <h1>About</h1>
    <p>This is the about page</p>
    <p>
      <Link href="/">
        <a>Go home {allProps.done} {allProps.valid}</a>
      </Link>
    </p>
  </Layout>
)

export const getServerSideProps: GetServerSideProps = async context => {
  dotenv.config();
  await DbInterface.init();

  const user = await PersistentObjectUtils.LoadOne(Requests.UsersByLogin, 'LePhasme');

  const valid = await user.verifyPassword(process.env.DB_PASS);

  console.log('plop', typeof user, typeof context);
  const allProps = {
    done: user.name,
    valid: valid ? 'ok' : 'not ok'
  };
  return {
    props: {
      allProps
    }
  }
}

export default AboutPage
