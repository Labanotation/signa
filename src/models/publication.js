const { BaseObject } = require('./base')
const { Validator } = require('../utils/validator')

// @TODO TYPE ???

/*
export interface IPublication {
  id?: string
  name?: string
  description?: string
  project?: Project // @TODO
  created?: Date // @TODO
  createdBy?: User // @TODO
  revision?: number // @TODO
  score?: { [key: number]: Score } // @TODO
  media?: { [key: number]: Media } // @TODO
  survey?: { [key: number]: Survey } // @TODO
  layout?: Layout // @TODO
}
*/

class Publication extends BaseObject {
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
  Publication: Publication
}