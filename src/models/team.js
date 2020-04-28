const { BaseObject } = require('./base')
const { Validator } = require('../utils/validator')

const Role = {
  Owner: 0,
  Teacher: 1,
  Writer: 2,
  Student: 3,
  Reader: 4,
  Billing: 5
}

const TeamType = {
  Working: 0,
  Teaching: 1
}

class Team extends BaseObject {
  get type() {
    return this.savedState.type
  }

  set type(type) {
    this.savedState.type = type
    this.saved = false
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

  get picture() {
    return this.savedState.picture
  }

  set picture(picture) {
    // @TODO
    this.savedState.picture = picture
    this.saved = false
  }

  get createdBy() {
    return this.savedState.createdBy
  }

  set createdBy(createdBy) {
    // @TODO
    this.savedState.createdBy = createdBy
    this.saved = false
  }

  get members() {
    return this.savedState.members
  }

  set members(members) {
    // @TODO add, validate, etc.
    this.savedState.members = members
    this.saved = false
  }

  get priv() {
    return (this.savedState.priv === true)
  }

  set priv(priv) {
    this.savedState.priv = (priv === true)
    this.saved = false
  }

  constructor() {
    super()
  }
}

module.exports = {
  Role: Role,
  TeamType: TeamType,
  Team: Team
}