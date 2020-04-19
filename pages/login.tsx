import React from 'react'
import { useState } from 'react'
import useUser from '../lib/hooks/useUser'
import Layout from '../components/layout'
import LoginForm from '../components/loginForm'
import fetch from '../lib/fetch'
import { mutate } from 'swr'
import { useI18n } from 'react-simple-i18n'

const Login = () => {
  useUser({ redirectTo: '/profile', redirectIfFound: true })
  const { t } = useI18n()

  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e) {
    event.preventDefault()

    const body = {
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value
    }

    try {
      const user = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      mutate('/api/user', user)
    } catch (error) {
      setErrorMsg(t('login.error'))
    }
  }

  return (
    <Layout>
      <div className="login">
        <p>{t('login.title')}</p>
        <LoginForm errorMessage={errorMsg} onSubmit={handleSubmit} />
      </div>
      <style jsx>{`
        .login {
          min-width: 21rem;
          max-width: 21rem;
          margin: 0 auto;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      `}</style>
    </Layout>
  )
}

export default Login