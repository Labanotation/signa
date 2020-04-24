const { BaseObject } = require('./base')
const { Validator } = require('../utils/validator')

const Type = {
  Image: 0,
  Video: 1,
  Audio: 2,
  Music: 3,
  Text: 4,
  Application: 5
}
// others (web): example, message, model, multipart

/*
export interface IMedia {
    id?: string
    name?: string
    description?: string
    type?: Type
    content?: string // @TODO
    project?: Project // @TODO
    created?: Date // @TODO
    createdBy?: User // @TODO
    revision?: number // @TODO
}
*/

class Media extends BaseObject {
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

  get type() {
    return this.savedState.type
  }

  get content() {
    return this.savedState.content
  }

  set content(content) {
    switch (this.type) {
      case Type.Image:
      case Type.Video:
      case Type.Audio:
        content = content.trim()
        if (Validator.Path(content)) {
          this.savedState.content = content
          this.saved = false
        }
        break
      case Type.Music:
      case Type.Text:
      case Type.Application:
      default:
        // @TODO
        this.savedState.content = content
        this.saved = false
        break
    }

  }

  constructor() {
    super()
  }
}

module.exports = {
  Type: Type,
  Media: Media
}