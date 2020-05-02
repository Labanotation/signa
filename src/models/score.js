const { BaseObject, IncludedBaseObject } = require('./base')
const { Validator } = require('../utils/validator')

// Score defines Performer(s) and is divided into ScorePart(s)
// ScorePart defines global staff settings (scale, metric, count, etc.)
// ScorePart is divided into ScoreSegment(s) which revolve around a fixed combination of Score Performer(s)
// A change in Performer(s) combination means a change of ScoreSegment
// ScoreSegment is the container for ScoreItem(s)

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

const ScoreMode = {
  KIN: 0,
  LAB: 1,
  Motif: 2
}

class Template extends BaseObject {
  // @TODO

  constructor() {
    super()
  }
}

class Pattern extends BaseObject {
  // @TODO

  constructor() {
    super()
  }
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

  get locked() {
    return (this.savedState.locked === true)
  }

  set locked(locked) {
    // @TODO
    this.savedState.locked = (locked === true)
    this.saved = false
  }

  get hidden() {
    return (this.savedState.hidden === true)
  }

  set hidden(hidden) {
    // @TODO
    this.savedState.hidden = (hidden === true)
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

class Performer extends BaseObject {
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

  get score() {
    return this.savedState.score
  }

  set score(score) {
    // @TODO
    this.savedState.score = score
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

  // @WARN avoid duplicate
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

class ScorePart extends IncludedBaseObject {
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

  get mode() {
    return this.savedState.mode
  }

  set mode(mode) {
    // @TODO
    this.savedState.mode = mode
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
    // @TODO [ScorePart]
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

  get folder() {
    return this.savedState.folder
  }

  set folder(folder) {
    // @TODO
    this.savedState.folder = folder
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
  ScoreMode: ScoreMode,
  Template: Template,
  Pattern: Pattern,
  ScoreItem: ScoreItem,
  FloorItem: FloorItem,
  Performer: Performer,
  ScoreSegment: ScoreSegment,
  FloorSegment: FloorSegment,
  ScorePart: ScorePart,
  Score: Score
}