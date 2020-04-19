import React from 'react'
import Link from 'next/link'
import useUser from '../lib/hooks/useUser'
import { useRouter } from 'next/router'
import { mutate } from 'swr'

const Header = () => {
  const user = useUser()
  const router = useRouter()
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link href="/">
              <a>Home</a>
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
          margin-left: auto;
        }
        a {
          color: #fff;
          text-decoration: none;
          display: flex;
          align-items: center;
        }
        a img {
          margin-right: 1em;
        }
        header {
          padding: 0.2rem;
          color: #fff;
          background-color: #333;
        }
      `}</style>
    </header>
  )
}

export default Header