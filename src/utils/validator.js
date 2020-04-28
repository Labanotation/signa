const countries = require('i18n-iso-countries')

class Validator {
  static Login(login) {
    if (login.length > 3 && /^[a-zA-Z0-9-_]+$/.test(login)) {
      return true
    } else {
      throw new Error('Invalid login format')
    }
  }

  static Name(name) {
    if (name.length > 0 && /^[a-zA-ZÀ-ÖÙ-Üà-öù-ü-_\s]+$/.test(name)) {
      return true
    } else {
      throw new Error('Invalid name format')
    }
  }

  static Title(name) {
    if (name.length > 0) {
      return true
    } else {
      throw new Error('Invalid name format')
    }
  }

  static Email(email) {
    if (email.length > 0 && /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email)) {
      return true
    } else {
      throw new Error('Invalid email format')
    }
  }

  static Url(url) {
    if (url.length > 0 && /^http/.test(url) === false && /^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(url)) {
      return true
    } else if (url.length > 0 && /^http/.test(url) === true && /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(url)) {
      return true
    } else {
      throw new Error('Invalid URL format')
    }
  }

  static Path(path) {
    if (path.length > 0) { // @TODO
      return true
    } else {
      throw new Error('Invalid path format')
    }
  }

  static Country(country) {
    if (countries.isValid(country)) {
      return true
    } else {
      throw new Error('Invalid country')
    }
  }
}

module.exports = {
  Validator: Validator
}