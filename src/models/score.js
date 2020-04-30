const { BaseObject, IncludedBaseObject } = require('./base')
const { Validator } = require('../utils/validator')

// @TODO
const ScoreType = {
  Reconstruction: 0,
  Creation: 1,
  Exercise: 2
}

const PerformerGenre = {
  Male: 0,
  Female: 1,
  Neutral: 2
}

class ScoreItem extends IncludedBaseObject {
  get type() {
    return this.savedState.type
  }

  set type(type) {
    // @TODO
    this.savedState.type = type
    this.saved = false
  }

  get column() {
    return this.savedState.column
  }

  set column(column) {
    // @TODO
    this.savedState.column = column
    this.saved = false
  }

  get time() {
    return this.savedState.time
  }

  set time(time) {
    // @TODO
    this.savedState.time = time
    this.saved = false
  }

  get duration() {
    return this.savedState.duration
  }

  set duration(duration) {
    // @TODO
    this.savedState.duration = duration
    this.saved = false
  }

  /* could use provided child/parent mechanisms
  get parentItem() {
    return this.savedState.parentItem
  }

  set parentItem(parentItem) {
    // @TODO
    this.savedState.parentItem = parentItem
    this.saved = false
  }

  get childrenItems() {
    return this.savedState.childrenItems
  }

  set childrenItems(childrenItems) {
    // @TODO
    this.savedState.childrenItems = childrenItems
    this.saved = false
  }
  */

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

class FloorItem extends IncludedBaseObject {
  get type() {
    return this.savedState.type
  }

  set type(type) {
    // @TODO
    this.savedState.type = type
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

class Performer extends IncludedBaseObject {
  get genre() {
    return this.savedState.genre
  }

  set genre(genre) {
    // @TODO
    this.savedState.genre = genre
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

  get abbr() {
    return this.savedState.abbr
  }

  set abbr(abbr) {
    // @TODO
    this.savedState.abbr = abbr
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

class ScoreSegment extends IncludedBaseObject {
  get timeBegin() {
    return this.savedState.timeBegin
  }

  set timeBegin(timeBegin) {
    // @TODO
    this.savedState.timeBegin = timeBegin
    this.saved = false
  }

  get timeEnd() {
    return this.savedState.timeEnd
  }

  set timeEnd(timeEnd) {
    // @TODO
    this.savedState.timeEnd = timeEnd
    this.saved = false
  }

  get performers() {
    return this.savedState.performers
  }

  set performers(performers) {
    // @TODO [Performer]
    this.savedState.performers = performers
    this.saved = false
  }

  get scoreItems() {
    return this.savedState.scoreItems
  }

  set scoreItems(scoreItems) {
    // @TODO [ScoreItem]
    this.savedState.scoreItems = scoreItems
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

class FloorSegment extends IncludedBaseObject {
  get timeBegin() {
    return this.savedState.timeBegin
  }

  set timeBegin(timeBegin) {
    // @TODO
    this.savedState.timeBegin = timeBegin
    this.saved = false
  }

  get timeEnd() {
    return this.savedState.timeEnd
  }

  set timeEnd(timeEnd) {
    // @TODO
    this.savedState.timeEnd = timeEnd
    this.saved = false
  }

  get performers() {
    return this.savedState.performers
  }

  set performers(performers) {
    // @TODO [Performer]
    this.savedState.performers = performers
    this.saved = false
  }

  get floorItems() {
    return this.savedState.floorItems
  }

  set floorItems(floorItems) {
    // @TODO [FloorItem]
    this.savedState.floorItems = floorItems
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

class Part extends IncludedBaseObject {
  get scoreSegments() {
    return this.savedState.scoreSegments
  }

  set scoreSegments(scoreSegments) {
    // @TODO [ScoreSegment]
    this.savedState.scoreSegments = scoreSegments
    this.saved = false
  }

  get floorSegments() {
    return this.savedState.floorSegments
  }

  set floorSegments(floorSegments) {
    // @TODO [FloorSegment]
    this.savedState.floorSegments = floorSegments
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

  get authors() {
    return this.savedState.authors
  }

  set authors(authors) {
    // @TODO [string | User]
    this.savedState.authors = authors
    this.saved = false
  }

  get notators() {
    return this.savedState.notators
  }

  set notators(notators) {
    // @TODO [string | User]
    this.savedState.notators = notators
    this.saved = false
  }

  get genres() {
    return this.savedState.genres
  }

  set genres(genres) {
    // @TODO
    this.savedState.genres = genres
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

  get parts() {
    return this.savedState.parts
  }

  set parts(parts) {
    // @TODO [Part]
    this.savedState.parts = parts
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
  ScoreType: ScoreType,
  PerformerGenre: PerformerGenre,
  ScoreItem: ScoreItem,
  FloorItem: FloorItem,
  Performer: Performer,
  ScoreSegment: ScoreSegment,
  FloorSegment: FloorSegment,
  Part: Part,
  Score: Score
}