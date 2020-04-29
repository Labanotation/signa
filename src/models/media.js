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

  set type(type) {
    // @TODO
    this.savedState.type = type
    this.saved = false
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

  get project() {
    return this.savedState.project
  }

  set project(project) {
    // @TODO
    this.savedState.project = project
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

  get priv() {
    return (this.savedState.priv === true)
  }

  set priv(priv) {
    this.savedState.priv = (priv === true)
    this.saved = false
  }

  get indexable() {
    return (this.savedState.indexable === true)
  }

  set indexable(indexable) {
    this.savedState.indexable = (indexable === true)
    this.saved = false
  }

  get parameters() {
    return this.savedState.parameters
  }

  set parameters(parameters) {
    // @TODO
    this.savedState.parameters = parameters
    this.saved = false
  }

  constructor() {
    super()
  }
}

module.exports = {
  Type: Type,
  Media: Media
}