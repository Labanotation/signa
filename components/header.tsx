import React from 'react'
import Link from 'next/link'
import useUser from '../lib/hooks/useUser'
import { useRouter } from 'next/router'
import { mutate } from 'swr'
import { useI18n } from 'react-simple-i18n'

const Header = () => {
  const user = useUser()
  const router = useRouter()
  const { t } = useI18n()
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link href="/">
              <a><img id="logo" src="/logo.png" alt="Signa" /></a>
            </Link>
          </li>
          <li>
            <Link href="/about">
              <a>{t('nav.about')}</a>
            </Link>
          </li>
          <li>
            <Link href="/doc">
              <a>{t('nav.doc')}</a>
            </Link>
          </li>
          <li className="last">
            <Link href="/explore">
              <a>{t('nav.explore')}</a>
            </Link>
          </li>
          {!user?._id && (
            <li>
              <Link href="/login">
                <a>Login</a>
              </Link>
            </li>
          )}
          {user?._id && (
            <>
              <li>
                <Link href="/profile">
                  <a>Profile</a>
                </Link>
              </li>
              <li>
                <a
                  href="/api/logout"
                  onClick={async e => {
                    e.preventDefault()
                    await fetch('/api/logout')
                    mutate('/api/user', {})
                    router.push('/login')
                  }}
                >
                  Logout
                </a>
              </li>
            </>
          )}
        </ul>
      </nav>
      <style jsx>{`
        #logo {
          width: 30px;
          background: #fff;
          border-radius: 15px;
          padding: 1px;
        }
        ul {
          display: flex;
          list-style: none;
          margin-left: 0;
          padding-left: 0;
        }
        li {
          margin-right: 1rem;
          display: flex;
        }
        li:first-child {
          margin-left: 0;
        }
        li.last {
          margin-right: auto;
        }
        a {
          color: #eee;
          text-decoration: none;
          display: flex;
          align-items: center;
        }
        a img {
          margin-left: 1em;
        }
        header {
          padding: 0.1rem;
          color: #eee;
          background-color: #333;
        }
      `}</style>
    </header>
  )
}

export default Header