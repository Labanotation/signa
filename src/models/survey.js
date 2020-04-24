const { BaseObject } = require('./base')
const { Validator } = require('../utils/validator')

/*
export interface ISurvey {
    id?: string
    name?: string
    description?: string
    content?: string // @TODO
    project?: Project // @TODO
    created?: Date // @TODO
    createdBy?: User // @TODO
    revision?: number // @TODO
}
*/

class Survey extends BaseObject {
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

  get description() {
    return this.savedState.description
  }

  set description(description) {
    this.savedState.description = description.trim()
    this.saved = false
  }

  get content() {
    return this.savedState.content
  }

  set content(content) {
    // @TODO
    this.savedState.content = content
    this.saved = false
  }

  constructor() {
    super()
  }
}

module.exports = {
  Survey: Survey
}