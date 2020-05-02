const { BaseObject } = require('./base')
const { Validator } = require('../utils/validator')

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

  get template() {
    return this.savedState.template
  }

  set template(template) {
    // @TODO
    this.savedState.template = template
    this.saved = false
  }

  get locations() {
    return this.savedState.locations
  }

  set locations(locations) {
    // @TODO
    this.savedState.locations = locations
    this.saved = false
  }

  get styles() {
    return this.savedState.styles
  }

  set styles(styles) {
    // @TODO
    this.savedState.styles = styles
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

  get project() {
    return this.savedState.project
  }

  set project(project) {
    // @TODO
    this.savedState.project = project
    this.saved = false
  }

  get folder() {
    return this.savedState.folder
  }

  set folder(folder) {
    // @TODO
    this.savedState.folder = folder
    this.saved = false
  }

  get priv() {
    return (this.savedState.priv === true)
  }

  set priv(priv) {
    this.savedState.priv = (priv === true)
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
  Layout: Layout
}