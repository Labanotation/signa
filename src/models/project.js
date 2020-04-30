const { BaseObject, IncludedBaseObject } = require('./base')
const { Validator } = require('../utils/validator')

class Post extends IncludedBaseObject {
  get content() {
    return this.savedState.content
  }

  set content(content) {
    // @TODO
    this.savedState.content = content
    this.saved = false
  }

  get likes() {
    return this.savedState.likes
  }

  set likes(likes) {
    // @TODO
    this.savedState.likes = likes
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

  constructor() {
    super()
  }
}

class Discussion extends BaseObject {
  get title() {
    return this.savedState.title
  }

  set title(title) {
    title = title.trim()
    if (Validator.Title(title)) {
      this.savedState.title = title
      this.saved = false
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

  get posts() {
    return this.savedState.posts
  }

  set posts(posts) {
    // @TODO
    this.savedState.posts = posts
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

class Project extends BaseObject {
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

  get owner() {
    return this.savedState.owner
  }

  set owner(owner) {
    // @TODO
    this.savedState.owner = owner
    this.saved = false
  }

  get contributors() {
    return this.savedState.contributors
  }

  set contributors(contributors) {
    // @TODO
    this.savedState.contributors = contributors
    this.saved = false
  }

  get stars() {
    return this.savedState.stars
  }

  set stars(stars) {
    // @TODO
    this.savedState.stars = stars
    this.saved = false
  }

  get watchers() { // --> [User]
    return this.savedState.watchers
  }

  set watchers(watchers) {
    // @TODO
    this.savedState.watchers = watchers
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

  get mediae() { // --> [Media]
    return this.savedState.mediae
  }

  set mediae(mediae) {
    // @TODO
    this.savedState.mediae = mediae
    this.saved = false
  }

  get publications() { // --> [Publication]
    return this.savedState.publications
  }

  set publications(publications) {
    // @TODO
    this.savedState.publications = publications
    this.saved = false
  }

  get scores() { // --> [Score]
    return this.savedState.scores
  }

  set scores(scores) {
    // @TODO
    this.savedState.scores = scores
    this.saved = false
  }

  get surveys() { // --> [Survey]
    return this.savedState.surveys
  }

  set surveys(surveys) {
    // @TODO
    this.savedState.surveys = surveys
    this.saved = false
  }

  get layouts() { // --> [Layout]
    return this.savedState.layouts
  }

  set layouts(layouts) {
    // @TODO
    this.savedState.layouts = layouts
    this.saved = false
  }

  constructor() {
    super()
  }
}

module.exports = {
  Post: Post,
  Discussion: Discussion,
  Project: Project
}