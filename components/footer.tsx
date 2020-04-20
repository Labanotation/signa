import React from 'react'
import Link from 'next/link'
import useUser from '../lib/hooks/useUser'
import { useRouter } from 'next/router'
import { mutate } from 'swr'
import { useI18n } from 'react-simple-i18n'

const Footer = () => {
    const user = useUser()
    const router = useRouter()
    const { t } = useI18n()
    return (
        <footer>
            <nav>
                <ul>
                    <li>
                        <Link href="/">
                            <a>{t('nav.home')}</a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/blog">
                            <a>{t('nav.blog')}</a>
                        </Link>
                    </li>
                    <li className="last">
                        <Link href="/contact">
                            <a>{t('nav.contact')}</a>
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
                    <li>
                        <Link href="https://nextjs.org/">
                            <a>Powered by Next.js</a>
                        </Link>
                    </li>
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
          margin-left: 1rem;
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
        footer {
          font-size: 70%;
          padding: 1px;
          color: #eee;
          background-color: #789;
        }
      `}</style>
        </footer>
    )
}

export default Footer