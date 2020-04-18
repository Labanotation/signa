import withIronSession from 'next-iron-session'
import dotenv from 'dotenv'

export default function withSession(handler) {
  dotenv.config()
  return withIronSession(handler, {
    password: process.env.IRON_PASS,
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production' ? true : false,
    }
  })
}