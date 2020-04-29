const { BaseObject } = require('./base')
const { Validator } = require('../utils/validator')
const argon2 = require('argon2')
const countries = require('i18n-iso-countries')

const Occupation = {
  Notator: 0,
  Choreographer: 1,
  Dancer: 2,
  Student: 3,
  Researcher: 4,
  Teacher: 5,
  Developer: 6,
  Musician: 7,
  Other: 8
}

class User extends BaseObject {
  get login() {
    return this.savedState.login
  }

  set login(login) {
    login = login.trim()
    if (Validator.Login(login)) {
      this.savedState.login = login
      this.saved = false
    }
  }

  get password() {
    return this.savedState.password
  }

  set password(hashedPassword) {
    this.savedState.password = hashedPassword
    this.saved = false
  }

  static async hashPassword(password) {
    return await argon2.hash(password)
  }

  static async verifyPassword(password, hashedPassword) {
    return await argon2.verify(hashedPassword, password)
  }

  async verifyPassword(password) {
    return await argon2.verify(this.password, password)
  }

  async validateSave() {
    const { DatastoreUtils, Requests } = require('../utils/datastore')
    const existingUserByLogin = await DatastoreUtils.PeekOne(Requests.UsersByLogin, this.login)
    const existingUserByEmail = await DatastoreUtils.PeekOne(Requests.UsersByEmail, this.email)
    if (this.root) {
      const existingUserRoot = await DatastoreUtils.PeekOne(Requests.UsersRoot)
      return (existingUserByLogin === null && existingUserByEmail === null && existingUserRoot === null) || (this.id && existingUserByLogin === this.id && existingUserByEmail === this.id && existingUserRoot === this.id)
    }
    return (existingUserByLogin === null && existingUserByEmail === null) || (this.id && existingUserByLogin === this.id && existingUserByEmail === this.id)
  }

  // @TODO GDPR
  get name() {
    return this.savedState.name
  }

  set name(name) {
    name = name.trim()
    if (Validator.Name(name)) {
      this.savedState.name = name
      this.saved = false
    }
  }

    // @TODO GDPR
  get email() {
    return this.savedState.email
  }

  set email(email) {
    email = email.trim()
    if (Validator.Email(email)) {
      this.savedState.email = email
      this.saved = false
    }
  }

  get description() {
    return this.savedState.description
  }

  set description(description) {
    this.savedState.description = description.trim()
    this.saved = false
  }

  // @TODO GDPR
  get picture() {
    return this.savedState.picture
  }

  set picture(picture) {
    // @TODO
    this.savedState.picture = picture
    this.saved = false
  }

  get url() {
    return this.savedState.url
  }

  set url(url) {
    url = url.trim()
    if (Validator.Url(url)) {
      this.savedState.url = url
      this.saved = false
    }
  }

  // @TODO GDPR?
  get occupation() {
    return this.savedState.occupation
  }

  set occupation(occupation) {
    // @TODO
    this.savedState.occupation = occupation
    this.saved = false
  }

  // @TODO GDPR?
  get lang() {
    return this.savedState.lang
  }

  set lang(lang) {
    // @TODO
    this.savedState.lang = lang
    this.saved = false
  }

  // @TODO GDPR?
  get country() {
    return this.savedState.country
  }

  set country(country) {
    country = country.trim()
    if (Validator.Country(country)) {
      this.savedState.country = countries.toAlpha3(country)
      this.saved = false
    }
  }

  get root() {
    return (this.savedState.root === true)
  }

  set root(root) {
    // @TODO
    this.savedState.root = (root === true)
    this.saved = false
  }

  get priv() {
    return (this.savedState.priv === true)
  }

  set priv(priv) {
    this.savedState.priv = (priv === true)
    this.saved = false
  }

  get indexable() {
    return (this.savedState.indexable === true)
  }

  set indexable(indexable) {
    this.savedState.indexable = (indexable === true)
    this.saved = false
  }

  get verified() {
    return (this.savedState.verified === true)
  }

  set verified(verified) {
    this.savedState.verified = (verified === true)
    this.saved = false
  }

  get parameters() {
    return this.savedState.parameters
  }

  set parameters(parameters) {
    // @TODO
    this.savedState.parameters = parameters
    this.saved = false
  }

  get status() {
    return this.unsavedState.status
  }

  set status(status) {
    // @TODO
    this.unsavedState.status = status
  }

  constructor() {
    super()
  }
}

module.exports = {
  Occupation: Occupation,
  User: User
}