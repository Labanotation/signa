const { BaseObject, IncludedBaseObject } = require('./base')
const { Validator } = require('../utils/validator')

// @TODO TYPE ???

/*
export interface IPublication {
  id?: string
  name?: string
  description?: string
  project?: Project // @TODO
  created?: Date // @TODO
  createdBy?: User // @TODO
  revision?: number // @TODO
  score?: { [key: number]: Score } // @TODO
  media?: { [key: number]: Media } // @TODO
  survey?: { [key: number]: Survey } // @TODO
  layout?: Layout // @TODO
}
*/

class Block extends IncludedBaseObject {
  get content() {
    return this.savedState.content
  }

  set content(content) {
    // @TODO validator Score || Survey || Media ID
    this.savedState.content = content
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

  get sections() {
    return this.savedState.sections
  }

  set sections(sections) {
    // @TODO validator
    this.savedState.sections = sections
    this.saved = false
  }

  constructor() {
    super()
  }
}

module.exports = {
  Block: Block,
  Page: Page,
  Section: Section,
  Publication: Publication
}