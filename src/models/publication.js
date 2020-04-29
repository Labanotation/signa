const { BaseObject, IncludedBaseObject } = require('./base')
const { Validator } = require('../utils/validator')

const PublishingMedia = {
  Screen: 0,
  Print: 1,
  Projection: 2
}

class Block extends IncludedBaseObject {
  get content() {
    return this.savedState.content
  }

  set content(content) {
    // @TODO validator Score || Survey || Media ID
    this.savedState.content = content
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

  get location() {
    return this.savedState.location
  }

  set location(location) {
    // @TODO validator
    this.savedState.location = location
    this.saved = false
  }

  get parameters() {
    return this.savedState.parameters
  }

  set parameters(parameters) {
    // @TODO validator
    this.savedState.parameters = parameters
    this.saved = false
  }

  constructor() {
    super()
  }
}

class Page extends IncludedBaseObject {
  get layout() {
    return this.savedState.layout
  }

  set layout(layout) {
    // @TODO validator
    this.savedState.layout = layout
    this.saved = false
  }

  get blocks() {
    return this.savedState.blocks
  }

  set blocks(blocks) {
    // @TODO validator
    this.savedState.blocks = blocks
    this.saved = false
  }

  get parameters() {
    return this.savedState.parameters
  }

  set parameters(parameters) {
    // @TODO validator
    this.savedState.parameters = parameters
    this.saved = false
  }

  constructor() {
    super()
  }
}

class Section extends IncludedBaseObject {
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

  get lang() {
    return this.savedState.lang
  }

  set lang(lang) {
    // @TODO
    this.savedState.lang = lang
    this.saved = false
  }

  get header() {
    return this.savedState.header
  }

  set header(header) {
    // @TODO validator
    header = header.trim()
    this.savedState.header = header
    this.saved = false
  }

  get footer() {
    return this.savedState.footer
  }

  set footer(footer) {
    // @TODO validator
    footer = footer.trim()
    this.savedState.footer = footer
    this.saved = false
  }

  get layout() {
    return this.savedState.layout
  }

  set layout(layout) {
    // @TODO validator
    this.savedState.layout = layout
    this.saved = false
  }

  get pages() {
    return this.savedState.pages
  }

  set pages(pages) {
    // @TODO validator
    this.savedState.pages = pages
    this.saved = false
  }

  get parameters() {
    return this.savedState.parameters
  }

  set parameters(parameters) {
    // @TODO validator
    this.savedState.parameters = parameters
    this.saved = false
  }

  constructor() {
    super()
  }
}

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

  get lang() {
    return this.savedState.lang
  }

  set lang(lang) {
    // @TODO
    this.savedState.lang = lang
    this.saved = false
  }

  get media() {
    return this.savedState.media
  }

  set media(media) {
    // @TODO
    this.savedState.media = media
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

  get sections() {
    return this.savedState.sections
  }

  set sections(sections) {
    // @TODO validator
    this.savedState.sections = sections
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
  PublishingMedia: PublishingMedia,
  Block: Block,
  Page: Page,
  Section: Section,
  Publication: Publication
}