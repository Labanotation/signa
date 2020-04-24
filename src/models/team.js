const { BaseObject } = require('./base')
const { Validator } = require('../utils/validator')

/*
export interface ITeam {
    id?: string
    type?: TeamType
    name?: string
    description?: string
    url?: string
    picture?: string // @TODO
    private?: boolean // @TODO
    created?: Date // @TODO
    createdBy?: User // @TODO
    members?: Array<ITeamMember>
}
*/

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

  get members() {
    return this.savedState.members
  }

  set members(members) {
    this.savedState.members = members
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