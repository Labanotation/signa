import { useEffect } from 'react'
import Router from 'next/router'
import useSWR from 'swr'
import fetch from '../fetch'

export default function useUser({
  redirectTo = '',
  redirectIfFound = false,
} = {}) {
  const { data: user } = useSWR('/api/user', fetch)
  useEffect(() => {
    if (!redirectTo || !user) return
    if (
      (redirectTo && !redirectIfFound && !user?._id) ||
      (redirectIfFound && user?._id)
    ) {
      Router.push(redirectTo)
    }
  }, [user, redirectIfFound, redirectTo])
  return user
}