import withSession from '../../lib/session'
import dotenv from 'dotenv'
import { DbInterface, PersistentObjectUtils, Requests } from '../../utils/persistent-object-utils'
import { User } from '../../interfaces/user'

export default withSession(async (req, res) => {
  const { username, password } = await req.body
  dotenv.config()
  await DbInterface.init()
  const user: User = await PersistentObjectUtils.LoadOne(Requests.UsersByLogin, username)
  if (user) {
    const valid = await user.verifyPassword(password)
    if (valid) {
      req.session.set('user', PersistentObjectUtils.Dehydrate(user))
      await req.session.save()
      res.json(req.session.get('user'))
    } else {
      req.session.set('user', null)
      res.status(500)
      res.json({})
    }
  } else {
    req.session.set('user', null)
    res.status(500)
    res.json({})
  }
})