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
            return done(null, user)
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
  </div>`)
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

app.get('/veggies/:name', function (req, res) {
  res.render('veggies/details', {
    veggie: req.params.name,
    layout: 'layout/veggie-details'
  })
})
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