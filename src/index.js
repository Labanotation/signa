require('dotenv').config()
const { Datastore, DatastoreUtils, Requests } = require('./utils/datastore')
const { Session } = require('./utils/session')
const db = Datastore.getInstance()
const fs = require('fs-extra')
const fp = require('path')
const express = require('express')
const i18n = require('i18n')
const hbs = require('express-hbs')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const PouchSession = require('session-pouchdb-store')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { Models } = require('./models')
const { Mailer } = require('./utils/mailer')
const jwt = require('jsonwebtoken')
const htmlToText = require('html-to-text')
const { Validator } = require('./utils/validator')
const { User } = require('./models/user')

let locales = []
let localesFiles = fs.readdirSync(fp.join(__dirname, 'locales'))
localesFiles.forEach((localesFile) => {
  if (/^\w\w\.json$/i.test(localesFile) === true) {
    locales.push(/^(\w\w)\.json$/i.exec(localesFile)[1].toLocaleLowerCase())
  }
})

i18n.configure({
  locales: locales,
  defaultLocale: process.env.DEFAULT_LANG,
  queryParameter: 'lang',
  cookie: process.env.I18N_COOKIE,
  directory: fp.join(__dirname, 'locales'),
  autoReload: true,
  objectNotation: true
})

passport.use(new LocalStrategy(
  { usernameField: 'login' },
  (login, password, done) => {
    DatastoreUtils.LoadOne(Requests.UsersByLogin, login).then((user) => {
      if (user) {
        user.verifyPassword(password).then((valid) => {
          if (valid) {
            if (user.verified === true) {
              return done(null, user)
            } else {
              return done(null, false)
            }
          } else {
            return done(null, false)
          }
        })
      } else {
        return done(null, false)
      }
    })
  }
))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  DatastoreUtils.LoadOne(Requests.Users, id).then((user) => {
    done(null, user)
  })
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(i18n.init)
app.use(express.static(fp.join(__dirname, 'static')))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: new PouchSession(`http://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SESSIONS_NAME}`)
}))
app.use(passport.initialize())
app.use(passport.session())

app.engine('hbs', hbs.express4({
  partialsDir: fp.join(__dirname, 'views', 'partials'),
  defaultLayout: fp.join(__dirname, 'views', 'layout', 'default.hbs'),
  i18n: i18n
}))
app.set('view engine', 'hbs')
app.set('views', fp.join(__dirname, 'views'))

hbs.registerHelper('iseq', function (entity, value) {
  return entity == value
})

hbs.registerHelper('isseq', function (entity, value) {
  return entity === value
})

app.get('/', function (req, res) {
  let userForTemplate = null
  let dataCompletionRequired = false
  if (req.isAuthenticated() && req.user) {
    userForTemplate = req.user.dehydrate()
    if (userForTemplate.name) {
      userForTemplate.shortName = userForTemplate.name.split(/\s/)[0]
    } else {
      userForTemplate.shortName = userForTemplate.login
      dataCompletionRequired = true
    }
  }
  res.render('index', {
    title: 'Signa',
    lang: req.getLocale(),
    isAuthenticated: req.isAuthenticated(),
    user: userForTemplate,
    dataCompletionRequired: dataCompletionRequired
  })
})

app.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/')
  } else {
    Session.incrementViews(req, 'login')
    res.render('login', {
      title: 'Signa > ' + i18n.__('login.title'),
      lang: req.getLocale(),
      isAuthenticated: req.isAuthenticated(),
      count: Session.getViews(req, 'login')
    })
  }
})

app.post('/login', (req, res, next) => {
  if (req.body.fullname === '') {
    passport.authenticate('local', (err, user, info) => {
      req.login(user, (err) => {
        if (user) {
          return res.redirect('/dashboard')
        } else {
          Session.incrementViews(req, 'login')
          res.render('login', {
            title: 'Signa > ' + i18n.__('login.title'),
            lang: req.getLocale(),
            isAuthenticated: req.isAuthenticated(),
            invalid: true,
            login_value: req.body.login.trim(),
            password_value: req.body.password.trim(),
            count: Session.getViews(req, 'login')
          })
        }
      })
    })(req, res, next)
  } else {
    Session.incrementViews(req, 'login')
    res.render('login', {
      title: 'Signa > ' + i18n.__('login.title'),
      lang: req.getLocale(),
      isAuthenticated: req.isAuthenticated(),
      invalid: true,
      login_value: req.body.login.trim(),
      password_value: req.body.password.trim(),
      count: Session.getViews(req, 'login')
    })
  }
})

app.get('/signup', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/')
  } else {
    res.render('signup', {
      title: 'Signa > ' + i18n.__('signup.title'),
      lang: req.getLocale(),
      isAuthenticated: req.isAuthenticated()
    })
  }
})

app.post('/signup', async (req, res, next) => {
  let errors = []
  try {
    Validator.Email(req.body.email.trim())
    let pendingAlready = false
    const existingUsersByEmail = await DatastoreUtils.Load(Requests.UsersByEmail, req.body.email.trim())
    existingUsersByEmail.forEach((existingUser) => {
      if (pendingAlready === false && existingUser.verified === false) {
        pendingAlready = true
      }
    })
    if (pendingAlready === true) {
      errors.push('mail_invalid')
    }
  } catch (ignore) {
    errors.push('mail_invalid')
  }
  try {
    Validator.Login(req.body.login.trim())
    const existingUserByLogin = await DatastoreUtils.PeekOne(Requests.UsersByLogin, req.body.login.trim())
    if (existingUserByLogin) {
      errors.push('login_invalid')
    }
  } catch (ignore) {
    errors.push('login_invalid')
  }
  try {
    Validator.Password(req.body.password.trim())
    Validator.Password(req.body.confirm_password.trim())
    if (req.body.password.trim() !== req.body.confirm_password.trim()) {
      errors.push('password_different')
    }
  } catch (ignore) {
    errors.push('password_invalid')
  }
  if (req.body.fullname === '') {
    if (errors.length > 0) {
      res.render('signup', {
        title: 'Signa > ' + i18n.__('signup.title'),
        lang: req.getLocale(),
        isAuthenticated: req.isAuthenticated(),
        mail_invalid: errors.indexOf('mail_invalid') !== -1,
        mail_value: req.body.email.trim(),
        login_invalid: errors.indexOf('login_invalid') !== -1,
        login_value: req.body.login.trim(),
        password_invalid: errors.indexOf('password_invalid') !== -1,
        password_value: req.body.password.trim(),
        password_different: errors.indexOf('password_different') !== -1,
        confirm_password_value: req.body.confirm_password.trim()
      })
    } else {
      const pendingUser = new Models.User()
      pendingUser.login = req.body.login.trim()
      pendingUser.email = req.body.email.trim()
      pendingUser.password = await Models.User.hashPassword(req.body.password.trim())
      pendingUser.verified = false
      const savedUser = await DatastoreUtils.Save(pendingUser)
      if (savedUser && savedUser[0] && savedUser[0].ok) {
        const accessToken = jwt.sign({ login: pendingUser.login, email: pendingUser.email, id: pendingUser.id, action: 'verify' }, process.env.JWT_SECRET, { expiresIn: '3600s' })
        fs.readFile(fp.join(__dirname, 'views', 'layout', 'email-struct.hbs'), async (err, data) => {
          const link = process.env.BASE_URL + '/signupvalidation/' + accessToken
          const template = hbs.compile(data.toString())
          const html = template({
            title: i18n.__('signup.mail_title', pendingUser.login),
            body: i18n.__('signup.validation_link', pendingUser.login, link)
          })
          await Mailer.getInstance().send(pendingUser.email, i18n.__('signup.mail_title', pendingUser.login), htmlToText.fromString(html), html)
          pendingUser.signuptoken = accessToken
          await DatastoreUtils.Save(pendingUser)
          res.render('signup', {
            title: 'Signa > ' + i18n.__('signup.title'),
            lang: req.getLocale(),
            isAuthenticated: req.isAuthenticated(),
            pending: true
          })
        })
      } else {
        res.render('signup', {
          title: 'Signa > ' + i18n.__('signup.title'),
          lang: req.getLocale(),
          isAuthenticated: req.isAuthenticated(),
          mail_value: req.body.email.trim(),
          login_value: req.body.login.trim(),
          password_value: req.body.password.trim(),
          error: true
        })
      }
    }
  } else {
    res.render('signup', {
      title: 'Signa > ' + i18n.__('signup.title'),
      lang: req.getLocale(),
      isAuthenticated: req.isAuthenticated(),
      mail_value: req.body.email.trim(),
      login_value: req.body.login.trim(),
      password_value: req.body.password.trim(),
      error: true
    })
  }
})

// @TODO *CRON* delete User verified === false && token expired
app.get('/signupvalidation/:token', async (req, res) => {
  jwt.verify(req.params.token, process.env.JWT_SECRET, async (err, userData) => {
    if (!err && userData.login && userData.email && userData.id && userData.action && userData.action === 'verify') {
      const pendingUser = await DatastoreUtils.LoadOne(Requests.UsersByLogin, userData.login)
      if (pendingUser && pendingUser.email === userData.email && pendingUser.id === userData.id && pendingUser.verified === false && pendingUser.signuptoken === req.params.token) {
        pendingUser.verified = true
        pendingUser.signuptoken = ''
        const savedUser = await DatastoreUtils.Save(pendingUser)
        if (savedUser && savedUser[0] && savedUser[0].ok) {
          res.render('signup', {
            title: 'Signa > ' + i18n.__('signup.title'),
            lang: req.getLocale(),
            isAuthenticated: req.isAuthenticated(),
            validated: true
          })
        } else {
          res.render('signup', {
            title: 'Signa > ' + i18n.__('signup.title'),
            lang: req.getLocale(),
            isAuthenticated: req.isAuthenticated(),
            error: true
          })
        }
      } else {
        res.render('signup', {
          title: 'Signa > ' + i18n.__('signup.title'),
          lang: req.getLocale(),
          isAuthenticated: req.isAuthenticated(),
          error: true
        })
      }
    } else {
      res.render('signup', {
        title: 'Signa > ' + i18n.__('signup.title'),
        lang: req.getLocale(),
        isAuthenticated: req.isAuthenticated(),
        error: true
      })
    }
  })
})

app.get('/forgotpassword', (req, res) => {
  res.render('forgotpassword', {
    title: 'Signa > ' + i18n.__('forgotpassword.title'),
    lang: req.getLocale(),
    isAuthenticated: req.isAuthenticated()
  })
})

app.post('/forgotpassword', async (req, res, next) => {
  let invalid = true
  let existingUserByLogin = null
  try {
    Validator.Login(req.body.login.trim())
    existingUserByLogin = await DatastoreUtils.LoadOne(Requests.UsersByLogin, req.body.login.trim())
    if (existingUserByLogin) {
      invalid = false
    }
  } catch (ignore) { }
  if (req.body.fullname === '' && invalid === false && existingUserByLogin) {
    await resetPassword(req, res, existingUserByLogin)
  } else {
    res.render('forgotpassword', {
      title: 'Signa > ' + i18n.__('forgotpassword.title'),
      lang: req.getLocale(),
      isAuthenticated: req.isAuthenticated(),
      login_value: req.body.login.trim(),
      invalid: true
    })
  }
})

// @TODO MOVE ELSEWHERE
async function resetPassword(req, res, user) {
  const accessToken = jwt.sign({ login: user.login, email: user.email, id: user.id, action: 'reset' }, process.env.JWT_SECRET, { expiresIn: '3600s' })
  fs.readFile(fp.join(__dirname, 'views', 'layout', 'email-struct.hbs'), async (err, data) => {
    const link = process.env.BASE_URL + '/resetpassword/' + accessToken
    const template = hbs.compile(data.toString())
    const html = template({
      title: i18n.__('forgotpassword.mail_title', user.login),
      body: i18n.__('forgotpassword.validation_link', user.login, link)
    })
    await Mailer.getInstance().send(user.email, i18n.__('forgotpassword.mail_title', user.login), htmlToText.fromString(html), html)
    user.signuptoken = accessToken
    await DatastoreUtils.Save(user)
    res.render('forgotpassword', {
      title: 'Signa > ' + i18n.__('forgotpassword.title'),
      lang: req.getLocale(),
      isAuthenticated: req.isAuthenticated(),
      pending: user.email
    })
  })
}

app.get('/resetpassword/:token', async (req, res) => {
  jwt.verify(req.params.token, process.env.JWT_SECRET, async (err, userData) => {
    if (!err && userData.login && userData.email && userData.id && userData.action && userData.action === 'reset') {
      const pendingUser = await DatastoreUtils.LoadOne(Requests.UsersByLogin, userData.login)
      if (pendingUser && pendingUser.email === userData.email && pendingUser.id === userData.id && pendingUser.verified === true && pendingUser.signuptoken === req.params.token) {
        res.render('resetpassword', {
          title: 'Signa > ' + i18n.__('resetpassword.title'),
          lang: req.getLocale(),
          isAuthenticated: req.isAuthenticated(),
          token_value: req.params.token
        })
      }
    } else {
      res.render('forgotpassword', {
        title: 'Signa > ' + i18n.__('forgotpassword.title'),
        lang: req.getLocale(),
        isAuthenticated: req.isAuthenticated(),
        invalid: true
      })
    }
  })
})

app.post('/resetpassword/:token', async (req, res, next) => {
  jwt.verify(req.params.token, process.env.JWT_SECRET, async (err, userData) => {
    if (!err && userData.login && userData.email && userData.id && userData.action && userData.action === 'reset') {
      let errors = []
      try {
        Validator.Password(req.body.password.trim())
        Validator.Password(req.body.confirm_password.trim())
        if (req.body.password.trim() !== req.body.confirm_password.trim()) {
          errors.push('password_different')
        }
      } catch (ignore) {
        errors.push('password_invalid')
      }
      if (errors.length > 0) {
        res.render('resetpassword', {
          title: 'Signa > ' + i18n.__('resetpassword.title'),
          lang: req.getLocale(),
          isAuthenticated: req.isAuthenticated(),
          password_invalid: errors.indexOf('password_invalid') !== -1,
          password_value: req.body.password.trim(),
          password_different: errors.indexOf('password_different') !== -1,
          confirm_password_value: req.body.confirm_password.trim(),
          token_value: req.params.token
        })
      } else {
        const existingUserByLogin = await DatastoreUtils.LoadOne(Requests.UsersByLogin, userData.login)
        if (!existingUserByLogin || existingUserByLogin.id !== userData.id || existingUserByLogin.email !== userData.email || existingUserByLogin.signuptoken !== req.params.token) {
          res.render('forgotpassword', {
            title: 'Signa > ' + i18n.__('forgotpassword.title'),
            lang: req.getLocale(),
            isAuthenticated: req.isAuthenticated(),
            invalid: true
          })
        } else {
          existingUserByLogin.password = await Models.User.hashPassword(req.body.password.trim())
          existingUserByLogin.signuptoken = ''
          await DatastoreUtils.Save(existingUserByLogin)
          res.render('resetpassword', {
            title: 'Signa > ' + i18n.__('resetpassword.title'),
            lang: req.getLocale(),
            isAuthenticated: req.isAuthenticated(),
            success: true
          })
        }
      }
    } else {
      res.render('forgotpassword', {
        title: 'Signa > ' + i18n.__('forgotpassword.title'),
        lang: req.getLocale(),
        isAuthenticated: req.isAuthenticated(),
        invalid: true
      })
    }
  })
})

/*
app.get('/email', (req, res) => {
  fs.readFile(fp.join(__dirname, 'views', 'layout', 'email-struct.hbs'), (err, data) => {
    const template = hbs.compile(data.toString())
    let html = ''
    let logins = ['Toto', 'Tutu', 'Tata']
    if (logins.length > 1) {
      html = template({
        title: i18n.__('forgotlogin.mail_title', 'bar'),
        body: i18n.__('forgotlogin.mail_content_many', '<li>' + logins.join('</li><li>') + '</li>')
      })
    } else {
      html = template({
        title: i18n.__('forgotlogin.mail_title', 'bar'),
        body: i18n.__('forgotlogin.mail_content_single', logins[0])
      })
    }
    res.send(html)
  })
})
*/

app.get('/forgotlogin', (req, res) => {
  res.render('forgotlogin', {
    title: 'Signa > ' + i18n.__('forgotlogin.title'),
    lang: req.getLocale(),
    isAuthenticated: req.isAuthenticated()
  })
})

app.post('/forgotlogin', async (req, res) => {
  let invalid = false
  let existingUsersByEmail = []
  try {
    Validator.Email(req.body.email.trim())
    existingUsersByEmail = await DatastoreUtils.Load(Requests.UsersByEmail, req.body.email.trim())
  } catch (ignore) {
    invalid = true
  }
  if (req.body.fullname === '' && invalid === false && existingUsersByEmail.length > 0) {
    fs.readFile(fp.join(__dirname, 'views', 'layout', 'email-struct.hbs'), async (err, data) => {
      const template = hbs.compile(data.toString())
      let html = ''
      let logins = []
      existingUsersByEmail.forEach((user) => {
        logins.push(user.login)
      })
      if (logins.length > 1) {
        html = template({
          title: i18n.__('forgotlogin.mail_title'),
          body: i18n.__('forgotlogin.mail_content_many', '<li>' + logins.join('</li><li>') + '</li>')
        })
      } else {
        html = template({
          title: i18n.__('forgotlogin.mail_title'),
          body: i18n.__('forgotlogin.mail_content_single', logins[0])
        })
      }
      await Mailer.getInstance().send(req.body.email.trim(), i18n.__('forgotlogin.mail_title'), htmlToText.fromString(html), html)
      res.render('forgotlogin', {
        title: 'Signa > ' + i18n.__('forgotlogin.title'),
        lang: req.getLocale(),
        isAuthenticated: req.isAuthenticated(),
        pending: true
      })
    })
  } else {
    res.render('forgotlogin', {
      title: 'Signa > ' + i18n.__('forgotlogin.title'),
      lang: req.getLocale(),
      isAuthenticated: req.isAuthenticated(),
      mail_value: req.body.email.trim(),
      mail_invalid: true
    })
  }
})

app.get('/logout', (req, res) => {
  Session.reset(req)
  req.logOut()
  return res.redirect('/')
})

app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    let userForTemplate = req.user.dehydrate()
    let dataCompletionRequired = false
    if (userForTemplate.name) {
      userForTemplate.shortName = userForTemplate.name.split(/\s/)[0]
    } else {
      userForTemplate.shortName = userForTemplate.login
      dataCompletionRequired = true
    }
    res.render('dashboard', {
      title: 'Signa > Dashboard',
      lang: req.getLocale(),
      isAuthenticated: req.isAuthenticated(),
      user: userForTemplate,
      active_dashboard: true,
      dataCompletionRequired: dataCompletionRequired,
      countries: User.getCountries(req.getLocale()),
      occupations: User.getOccupations(req.getLocale())
    })
  } else {
    res.redirect('/login')
  }
})

app.post('/dashboard', async (req, res, next) => {
  if (req.body && req.isAuthenticated()) {
    if (req.body.delete === '1') {
      // @TODO DELETE ACCOUNT
    } else if (req.body.reset === '1') {
      // @TODO RESET PASSWORD
    } else if (req.body.save === '1') {
      // @TODO PICTURE
      let dataSaved = false
      let name_invalid = false
      let mail_invalid = false
      let url_invalid = false
      try {
        req.user.name = req.body.name
      } catch (ignore) {
        name_invalid = true
      }
      try {
        req.user.email = req.body.email
      } catch (ignore) {
        mail_invalid = true
      }
      if (req.body.url) {
        try {
          req.user.url = req.body.url
        } catch (ignore) {
          url_invalid = true
        }
      }
      if (req.body.description) {
        req.user.description = req.body.description
      }
      if (req.body.occupation) {
        if (req.body.occupation !== 'null') {
          req.user.occupation = req.body.occupation
        } else {
          req.user.occupation = undefined
        }
      }
      if (req.body.lang) {
        req.user.lang = req.body.lang
        res.cookie(process.env.I18N_COOKIE, req.user.lang, { maxAge: 900000, httpOnly: true })
        req.setLocale(req.user.lang)
      }
      if (req.body.country) {
        if (req.body.country !== 'null') {
          req.user.country = req.body.country
        } else {
          req.user.country = undefined
        }
      }
      if (req.body.priv && req.body.priv === 'on') {
        req.user.priv = true
      } else {
        req.user.priv = false
      }
      if (req.body.indexable && req.body.indexable === 'on') {
        req.user.indexable = true
      } else {
        req.user.indexable = false
      }
      if (name_invalid === false && mail_invalid === false && url_invalid === false) {
        const savedUser = await DatastoreUtils.Save(req.user)
        if (savedUser && savedUser[0] && savedUser[0].ok) {
          dataSaved = true
        }
      }
      let userForTemplate = req.user.dehydrate()
      if (name_invalid === true || mail_invalid === true || url_invalid === true) {
        userForTemplate.name = req.body.name
        userForTemplate.email = req.body.email
        userForTemplate.url = req.body.url
        userForTemplate.description = req.body.description
        userForTemplate.occupation = req.body.occupation
        userForTemplate.lang = req.body.lang
        userForTemplate.country = req.body.country
        userForTemplate.priv = (req.body.priv === 'on')
        userForTemplate.indexable = (req.body.indexable === 'on')
      }
      let dataCompletionRequired = false
      if (userForTemplate.name) {
        userForTemplate.shortName = userForTemplate.name.split(/\s/)[0]
      } else {
        userForTemplate.shortName = userForTemplate.login
        dataCompletionRequired = true
      }
      res.render('dashboard', {
        title: 'Signa > Dashboard',
        lang: req.getLocale(),
        isAuthenticated: req.isAuthenticated(),
        user: userForTemplate,
        active_dashboard: true,
        dataCompletionRequired: dataCompletionRequired,
        countries: User.getCountries(req.getLocale()),
        occupations: User.getOccupations(req.getLocale()),
        name_invalid: name_invalid,
        mail_invalid: mail_invalid,
        url_invalid: url_invalid,
        dataSaved: dataSaved
      })
    }
  } else {
    res.redirect('/login')
  }
  /*
  {
    from: 'profile',
    fullname: '',
    priv: 'on',
    indexable: 'on',
    login: 'LePhasme',
    name: 'Sébastien Courvoisier',
    email: 'sebastien.courvoisier@gmail.com',
    description: '',
    url: 'www.bpifrance.fr',
    occupation: '1',
    lang: 'fr',
    country: 'FR',
    delete: '1' // reset: 1 // save: 1
  }
  try {
    Validator.Login(req.body.login.trim())
    existingUserByLogin = await DatastoreUtils.LoadOne(Requests.UsersByLogin, req.body.login.trim())
    if (existingUserByLogin) {
      invalid = false
    }
  } catch (ignore) { }
  if (req.body.fullname === '' && invalid === false && existingUserByLogin) {
    await resetPassword(req, res, existingUserByLogin)
  } else {
    res.render('forgotpassword', {
      title: 'Signa > ' + i18n.__('forgotpassword.title'),
      lang: req.getLocale(),
      isAuthenticated: req.isAuthenticated(),
      login_value: req.body.login.trim(),
      invalid: true
    })
  }
  */
})

// KEEP THOSE TWO AT THE BOTTOM OF THE STACK:
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).render('error', {
    title: 'Signa > ' + i18n.__('Error500'),
    error_id: i18n.__('Error500'),
    error_msg: i18n.__('ServerError')
  })
})

app.use(function (req, res, next) {
  let userForTemplate = null
  if (req.isAuthenticated() && req.user) {
    userForTemplate = req.user.dehydrate()
    if (userForTemplate.name) {
      userForTemplate.shortName = userForTemplate.name.split(/\s/)[0]
    } else {
      userForTemplate.shortName = userForTemplate.login
    }
  }
  res.status(404).render('error', {
    title: 'Signa > ' + i18n.__('Error404'),
    error_id: i18n.__('Error404'),
    error_msg: i18n.__('NotFound'),
    lang: req.getLocale(),
    isAuthenticated: req.isAuthenticated(),
    user: userForTemplate
  })
})

async function init() {
  const dbIsReady = await db.init()
  app.listen(process.env.HTTP_PORT)
  if (dbIsReady === false) {
    fs.readFile(fp.join(__dirname, 'views', 'layout', 'email-struct.hbs'), async (err, data) => {
      const template = hbs.compile(data.toString())
      let html = template({
        title: 'Signa Alert : NO DB',
        body: '<h1>Signa started without DB!</h1>'
      })
      await Mailer.getInstance().send(process.env.EMAIL_LOGIN, 'Signa Alert : NO DB', htmlToText.fromString(html), html)
    })
  }
}

init()