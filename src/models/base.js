class BaseObject {
  get isIncluded() {
    return false
  }

  isSaved(obj) {
    if (obj === undefined) {
      obj = this
    }
    let saved = true
    if (obj.unsavedState !== undefined && obj.unsavedState.saved !== undefined) {
      saved = obj.unsavedState.saved
    }
    if (obj.savedState !== undefined && obj.savedState instanceof Object && obj.savedState.constructor === Object) {
      saved = saved && this.isSaved(obj.savedState)
    } else {
      for (const prop in obj) {
        if (Array.isArray(obj[prop])) {
          for (const item of obj[prop]) {
            saved = saved && this.isSaved(item)
          }
        } else if (obj[prop] instanceof Object && obj[prop].constructor === Object) {
          saved = saved && this.isSaved(obj[prop])
        }
      }
    }
    return saved
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