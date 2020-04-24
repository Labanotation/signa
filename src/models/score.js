const { BaseObject } = require('./base')
const { Validator } = require('../utils/validator')

/*
Table score as S {
    type int
    author string
    notator string
    genre string
    tags string
    revision int
}
*/
/*
export interface IScore {
    id?: string
    name?: string
    description?: string
    project?: Project // @TODO
    status?: number // @TODO
    created?: Date // @TODO
    createdBy?: User // @TODO
    revision?: number // @TODO
    locked?: boolean // @TODO
}
*/

class Score extends BaseObject {
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
  Score: Score
}