import React from 'react'
import { useI18n } from 'react-simple-i18n'

const LoginForm = ({ errorMessage, onSubmit }) => {
  const { t } = useI18n()

  return (
    <form onSubmit={onSubmit}>
      <label>
        <span>{t('login.username')}</span>
        <input type="text" name="username" autoComplete="username" required />
      </label>

      <label>
        <span>{t('login.password')}</span>
        <input type="password" name="password" autoComplete="current-password" required />
      </label>

      <button type="submit">{t('login.submit')}</button>

      {errorMessage && <p className="error">{errorMessage}</p>}

      <style jsx>{`
      form,
      label {
        display: flex;
        flex-flow: column;
      }
      label > span {
        font-weight: 600;
      }
      input {
        padding: 8px;
        margin: 0.3rem 0 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      .error {
        color: brown;
        margin: 1rem 0 0;
      }
    `}</style>
    </form>
  )
}

export default LoginForm