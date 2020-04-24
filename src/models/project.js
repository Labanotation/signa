const { BaseObject } = require('./base')
const { Validator } = require('../utils/validator')

/*
export interface IProject {
    id?: string
    name?: string
    description?: string
    picture?: string // @TODO
    owner?: User | Team
    status?: number // @TODO
    private?: boolean // @TODO
    created?: Date // @TODO
    createdBy?: User // @TODO
}
*/

class Project extends BaseObject {
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

  get owner() {
    return this.savedState.owner
  }

  constructor() {
    super()
  }
}

module.exports = {
  Project: Project
}