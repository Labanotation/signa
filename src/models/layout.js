const { BaseObject } = require('./base')
const { Validator } = require('../utils/validator')

/*
export interface ILayout {
    id?: string
    name?: string
    description?: string
    // @TODO
}
*/

class Layout extends BaseObject {
  get name() {
    return this.savedState.name
  }

  set name(name) {
    name = name.trim()
    if (Validator.Title(name)) {
      this.savedState.name = name
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

  constructor() {
    super()
  }
}

module.exports = {
  Layout: Layout
}