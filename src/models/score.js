const { BaseObject } = require('./base')
const { Validator } = require('../utils/validator')

// @TODO
const ScoreType = {
  Reconstruction: 0,
  Creation: 1,
  Exercise: 2
}

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

  get type() {
    return this.savedState.type
  }

  set type(type) {
    // @TODO
    this.savedState.type = type
    this.saved = false
  }

  get lang() {
    return this.savedState.lang
  }

  set lang(lang) {
    // @TODO
    this.savedState.lang = lang
    this.saved = false
  }

  get author() {
    return this.savedState.author
  }

  set author(author) {
    // @TODO string | User
    this.savedState.author = author
    this.saved = false
  }

  get notator() {
    return this.savedState.author
  }

  set notator(notator) {
    // @TODO string | User
    this.savedState.notator = notator
    this.saved = false
  }

  get genre() {
    return this.savedState.author
  }

  set genre(genre) {
    // @TODO
    this.savedState.genre = genre
    this.saved = false
  }

  get tags() {
    return this.savedState.tags
  }

  set tags(tags) {
    // @TODO
    this.savedState.tags = tags
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

  get createdBy() {
    return this.savedState.createdBy
  }

  set createdBy(createdBy) {
    // @TODO
    this.savedState.createdBy = createdBy
    this.saved = false
  }

  get finalized() {
    return (this.savedState.finalized === true)
  }

  set finalized(finalized) {
    this.savedState.finalized = (finalized === true)
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

  get settings() {
    return this.savedState.settings
  }

  set settings(settings) {
    // @TODO
    this.savedState.settings = settings
    this.saved = false
  }

  constructor() {
    super()
  }
}

module.exports = {
  ScoreType: ScoreType,
  Score: Score
}