class BaseObject {
  get isIncluded() {
    return false
  }

  get id() {
    return this.savedState._id
  }

  set id(id) {
    this.savedState._id = id
  }

  get revision() {
    return this.savedState._rev
  }

  set revision(revision) {
    this.savedState._rev = revision
  }

  get instanceOf() {
    return this.savedState.instanceOf
  }

  set instanceOf(instanceOf) {
    this.savedState.instanceOf = instanceOf
  }

  get saved() {
    return this.unsavedState.saved
  }

  set saved(saved) {
    this.unsavedState.saved = saved
  }

  get created() {
    return this.savedState.created
  }

  set created(created) {
    this.savedState.created = created
  }

  dehydrate() {
    return this.savedState
  }

  rehydrate(obj) {

  }

  async validateSave() {
    return true
  }

  constructor() {
    this.savedState = {}
    this.unsavedState = {}
  }
}

class IncludedBaseObject extends BaseObject {
  get isIncluded() {
    return true
  }

  constructor() {
    super()
  }
}

module.exports = {
  BaseObject: BaseObject,
  IncludedBaseObject: IncludedBaseObject
}