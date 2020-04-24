const { BaseObject } = require('./base')
const { Validator } = require('../utils/validator')
const argon2 = require('argon2')

/*
export interface IUser {
    id?: string
    login?: string
    name?: string
    email?: string
    description?: string
    url?: string
    picture?: string // @TODO
    occupation?: number // @TODO
    country?: number // @TODO
    status?: number // @TODO
    private?: boolean // @TODO
    verified?: boolean // @TODO
    created?: Date // @TODO
    password?: string
    lang?: string
    root?: boolean
}
*/

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

  get lang() {
    return this.savedState.lang
  }

  set lang(lang) {
    this.savedState.lang = lang
  }

  get root() {
    return this.savedState.root
  }

  set root(root) {
    this.savedState.root = root
  }

  get verified() {
    return this.savedState.verified
  }

  set verified(verified) {
    this.savedState.verified = verified
  }

  constructor() {
    super()
  }
}

module.exports = {
  User: User
}