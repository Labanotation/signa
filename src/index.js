require('dotenv').config()
const { Datastore, DatastoreUtils, Requests } = require('./utils/datastore')
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

i18n.configure({
  locales: ['en', 'fr'],
  defaultLocale: 'fr',
  queryParameter: 'lang',
  cookie: process.env.I18N_COOKIE,
  directory: __dirname + '/locales',
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
app.use(express.static(__dirname + '/static'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: new PouchSession(`http://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SESSIONS_NAME}`)
}))
app.use(passport.initialize())
app.use(passport.session())

app.engine('hbs', hbs.express4({
  partialsDir: __dirname + '/views/partials',
  defaultLayout: __dirname + '/views/layout/default.hbs',
  i18n: i18n
}))
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

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
      <div class="col bg-success text-light m-1 p-5">col</div>
      <div class="col bg-dark text-light m-1 p-5">col</div>
      <div class="col bg-success text-light m-1 p-5">col</div>
    </div>
    <div class="row">
      <div class="col bg-success text-light m-1">col-2</div>
      <div class="col bg-dark text-light m-1">col-2</div>
    </div>
  </div>`)
  return template({...options.hash, ...options.data.root})
})

/* Sync
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
  /* session stuff
  if (req.session.views) {
    req.session.views++
  } else {
    req.session.views = 1
  }
  */
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
    // count: req.session.views
  })
})

/*
app.get('/replace', function (req, res) {
  res.render('replace', {
    title: 'express-hbs example'
  })
})

app.get('/fruits', function (req, res) {
  res.cookie('locale', 'en', { maxAge: 900000, httpOnly: true })
  res.render('fruits/index', {
    title: 'My favorite fruits',
    fruits: fruits
  })
})

app.get('/fruits/:name', function (req, res) {
  res.render('fruits/details', {
    fruit: req.params.name
  })
})

app.get('/veggies', function (req, res) {
  res.render('veggies', {
    title: 'My favorite veggies',
    veggies: veggies,
    layout: 'layout/veggie'
  })
})

app.get('/veggies/:name', function (req, res) {
  res.render('veggies/details', {
    veggie: req.params.name,
    layout: 'layout/veggie-details'
  })
})
*/

app.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/')
  } else {
    res.render('login', {
      title: 'Signa',
      lang: req.getLocale(),
      isAuthenticated: req.isAuthenticated(),
      invalid: req.query.invalid !== undefined
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
  req.logOut()
  return res.redirect('/')
})

app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    let userForTemplate = req.user.dehydrate()
    userForTemplate.shortName = userForTemplate.name.split(/\s/)[0]
    res.render('dashboard', {
      title: 'Signa',
      lang: req.getLocale(),
      isAuthenticated: req.isAuthenticated(),
      user: userForTemplate,
      active_dashboard: true
    })
  } else {
    res.redirect('/login')
  }
})

async function init() {
  const dbIsReady = await db.init()
  if (dbIsReady === true) {
    app.listen(8080)
    /*
    const user1 = await DatastoreUtils.LoadOne(Requests.UsersByEmail, 'sebastien.courvoisier@gmail.com')
    console.log(user1.id)
    DatastoreUtils.LoadOne(Requests.UsersByEmail, 'sebastien.courvoisier@gmail.com').then((user) => {
      console.log('then', user.id)
    })
    const user2 = await DatastoreUtils.LoadOne(Requests.UsersByLogin, 'LePhasme')
    const valid1 = await user1.verifyPassword(process.env.DB_PASS)
    const valid2 = await user2.verifyPassword(process.env.DB_PASS)
    console.log(valid1, valid2, user1 === user2)
    const res = await DatastoreUtils.Save(user2)
    console.log(res)
    */
  } else {
    // @TODO
    console.log('no db, exit')
  }
}

init()