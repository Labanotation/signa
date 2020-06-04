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

hbs.registerHelper('layout', function (id, options) {
  const attrs = []
  if (options) {
    for (const prop in options.hash) {
      attrs.push(`${prop}="${options.hash[prop]}"`)
    }
  }
  const attributes = attrs.join(' ')
  const template = hbs.compile(`<div id="${id}" ${attributes} class="container my-2">
    <div class="row">
      <div class="col bg-dark text-light m-1 p-5">{{ user.name }}</div>
      <div class="col bg-success text-light m-1 p-5">row1 col2</div>
      <div class="col bg-dark text-light m-1 p-5">row1 col3</div>
      <div class="col bg-success text-light m-1 p-5">row1 col4</div>
    </div>
    <div class="row">
      <div class="col bg-success text-light m-1">row2 col1</div>
      <div class="col bg-dark text-light m-1">row2 col2</div>
    </div>
  </div>
  {{#contentFor "pageStyles"}}
<style type="text/css">
  .main-wrapper {
    display: grid;
    grid-template-columns: repeat(12, [col-start] 1fr);
    grid-gap: 0.25cm;
    background-color: powderblue;
    padding: 0;
    width: 10cm;
    margin: 0;
  }

  .main-header {
    background-color: pink;
    grid-column: col-start / -1;
  }
  .main-content {
    background-color: green;
    grid-column: col-start 2 / -2;
    grid-row: 2 / 4;
  }
  .main-nav {
    background-color: red;
    grid-column: col-start;
    grid-row: 2 / 3;
  }
  .main-nav2 {
    background-color: rgb(255, 0, 221);
    grid-column: col-start;
    grid-row: 3 / 4;
  }
  .main-side {
    background-color: blue;
    grid-column: -2;
    grid-row: 2 / 4;
  }
  .main-footer {
    background-color: lime;
    grid-column: col-start / -1;
    grid-row: 4;
  }
  </style>
  {{/contentFor}}`)
  return template({ ...options.hash, ...options.data.root })
})

/*
Sync
hbs.registerHelper('link', function (text, options) {
  const attrs = []
  for (const prop in options.hash) {
    attrs.push(prop + '="' + options.hash[prop] + '"')
  }
  return new hbs.SafeString(
    '<a ' + attrs.join(' ') + '>' + text + '</a>'
  )
})

Async
hbs.registerAsyncHelper('readFile', function (filename, cb) {
  fs.readFile(fp.join(__dirname + '/views', filename), 'utf8', function (err, content) {
    if (err) console.error(err)
    cb(new hbs.SafeString(content))
  })
})

set language: res.cookie('locale', 'en', { maxAge: 900000, httpOnly: true })
*/

app.get('/', function (req, res) {
  let userForTemplate = null
  if (req.isAuthenticated() && req.user) {
    userForTemplate = req.user.dehydrate()
    userForTemplate.shortName = userForTemplate.name.split(/\s/)[0]
  }
  res.render('index', {
    title: 'Signa',
    lang: req.getLocale(),
    isAuthenticated: req.isAuthenticated(),
    user: userForTemplate
  })
})

app.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/')
  } else {
    Session.incrementViews(req, 'login')
    res.render('login', {
      title: 'Signa | Login',
      lang: req.getLocale(),
      isAuthenticated: req.isAuthenticated(),
      invalid: req.query.invalid !== undefined,
      count: Session.getViews(req, 'login')
    })
  }
})

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    req.login(user, (err) => {
      if (user) {
        return res.redirect('/dashboard')
      } else {
        return res.redirect('/login?invalid')
      }
    })
  })(req, res, next)
})

app.get('/signup', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/')
  } else {
    res.render('signup', {
      title: 'Signa | Signup',
      lang: req.getLocale(),
      isAuthenticated: req.isAuthenticated(),
      mail_invalid: req.query.mail_invalid !== undefined,
      login_invalid: req.query.login_invalid !== undefined,
      password_invalid: req.query.password_invalid !== undefined
    })
  }
})

app.get('/email', (req, res) => {
  fs.readFile(fp.join(__dirname, 'views', 'layout', 'email-struct.hbs'), (err, data) => {
    const accessToken = jwt.sign({ foo: 'bar', action: 'verify' }, process.env.JWT_SECRET, { expiresIn: '3600s' })
    const link = process.env.BASE_URL + '/signupvalidation/' + accessToken
    const template = hbs.compile(data.toString())
    const html = template({
      title: i18n.__('signup.mail_title'),
      body: i18n.__('signup.validation_link', link)
    })
    res.send(html)
  })
})

// @TODO *CRON* delete User verified === false && token expired
app.get('/signupvalidation/:token', async (req, res) => {
  jwt.verify(req.params.token, process.env.JWT_SECRET, async (err, userData) => {
    if (!err && userData.login && userData.email && userData.id && userData.action && userData.action === 'verify') {
      const pendingUser = await DatastoreUtils.LoadOne(Requests.UsersByLogin, userData.login)
      if (pendingUser && pendingUser.email === userData.email && pendingUser.id === userData.id && pendingUser.verified === false && pendingUser.signuptoken === req.params.token) {
        pendingUser.verified = true
        const savedUser = await DatastoreUtils.Save(pendingUser)
        if (savedUser && savedUser[0] && savedUser[0].ok) {
          // @TODO CONFIRM + LINK TO LOGIN
          res.redirect('/signupconfirm')
        } else {
          // @TODO ERROR
          res.redirect('/signuperror')
        }
      } else {
        // @TODO ERROR
        res.redirect('/signuperror')
      }
    } else {
      // @TODO ERROR
      res.redirect('/signuperror')
    }
  })
})

app.post('/signup', async (req, res, next) => {
  let errors = []
  try {
    Validator.Email(req.body.email.trim())
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
  } catch (ignore) {
    errors.push('password_invalid')
  }
  if (req.body.fullname === '') {
    if (errors.length > 0) {
      res.redirect('/signup?' + errors.join('&'))
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
            title: i18n.__('signup.mail_title'),
            body: i18n.__('signup.validation_link', link)
          })
          await Mailer.getInstance().send(pendingUser.email, i18n.__('signup.mail_title'), htmlToText.fromString(html), html)
          pendingUser.signuptoken = accessToken
          await DatastoreUtils.Save(pendingUser)
          res.redirect('/signuppendingvalidation')
        })
      } else {
        // @TODO ERROR
        res.redirect('/signuperror')
      }
    }
  } else {
    // @TODO ERROR
    res.redirect('/signuperror')
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
    userForTemplate.shortName = userForTemplate.name.split(/\s/)[0]
    res.render('dashboard', {
      title: 'Signa | Dashboard',
      lang: req.getLocale(),
      isAuthenticated: req.isAuthenticated(),
      user: userForTemplate,
      active_dashboard: true
    })
  } else {
    res.redirect('/login')
  }
})

// KEEP THOSE TWO AT THE BOTTOM OF THE STACK:
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).render('500', {
    title: 'Signa | Server Error'
  })
})

app.use(function (req, res, next) {
  let userForTemplate = null
  if (req.isAuthenticated() && req.user) {
    userForTemplate = req.user.dehydrate()
    userForTemplate.shortName = userForTemplate.name.split(/\s/)[0]
  }
  res.status(404).render('404', {
    title: 'Signa | Page Not Found',
    lang: req.getLocale(),
    isAuthenticated: req.isAuthenticated(),
    user: userForTemplate
  })
})

async function init() {
  const dbIsReady = await db.init()
  if (dbIsReady === true) {
    app.listen(process.env.HTTP_PORT)
  } else {
    // @TODO
    console.log('no db, exit')
  }
}

init()