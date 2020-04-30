class BaseObject {
  get isIncluded() {
    return false
  }

  get allChildren() {
    return this.getAllChildren()
  }

  get allSeparateChildren() {
    const _allChildren = this.allChildren
    for (const item of _allChildren) {
      if (item instanceof IncludedBaseObject) {
        _allChildren.delete(item)
      }
    }
    return _allChildren
  }

  get allIncludedChildren() {
    const _allChildren = this.allChildren
    for (const item of _allChildren) {
      if (item instanceof IncludedBaseObject === false) {
        _allChildren.delete(item)
      }
    }
    return _allChildren
  }

  getAllChildren() {
    let stack = new Set(this.children)
    for (const item of this.children) {
      stack = new Set([...stack, ...item.getAllChildren()])
    }
    return stack
  }

  get children() {
    if (this.unsavedState.children === undefined) {
      this.unsavedState.children = new Set()
    }
    return this.unsavedState.children
  }

  set(prop, obj) {
    this[prop] = obj
    if (obj instanceof IncludedBaseObject) {
      obj.parent = this
    }
    if (obj instanceof BaseObject) {
      this.children.add(obj)
    }
    this.saved = false
  }

  unset(prop) {
    if (this[prop] instanceof BaseObject) {
      this.children.delete(this[prop])
    }
    if (this[prop] instanceof IncludedBaseObject) {
      this[prop].parent = undefined
    }
    this[prop] = undefined
    this.saved = false
  }

  add(prop, obj) {
    if (!this[prop]) {
      this[prop] = []
    }
    this[prop].push(obj)
    if (obj instanceof IncludedBaseObject) {
      obj.parent = this
    }
    if (obj instanceof BaseObject) {
      this.children.add(obj)
    }
    this.saved = false
  }

  first(prop) {
    if (Array.isArray(this[prop]) === false) {
      return this[prop]
    }
    if (this[prop].length === 0) {
      return undefined
    }
    return this[prop][0]
  }

  last(prop) {
    if (Array.isArray(this[prop]) === false) {
      return this[prop]
    }
    if (this[prop].length === 0) {
      return undefined
    }
    return this[prop][this[prop].length - 1]
  }

  nth(prop, n) {
    if (Array.isArray(this[prop]) === false) {
      return this[prop]
    }
    if (this[prop].length === 0) {
      return undefined
    }
    if (n < 0) {
      return this.first(prop)
    }
    if (n > this[prop].length - 1) {
      return this.last(prop)
    }
    return this[prop][n]
  }

  // @TODO find(prop, id), etc.

  remove(prop, obj) {
    if (!this[prop]) {
      this[prop] = []
    }
    if (obj instanceof BaseObject) {
      this.children.delete(obj)
    }
    if (obj instanceof IncludedBaseObject) {
      obj.parent = undefined
    }
    this[prop] = this[prop].filter(function (el) {
      return el !== obj
    })
    this.saved = false
  }

  /*
  isSaved(obj) {
    if (obj === undefined) {
      obj = this
    }
    let saved = true
    if (obj.unsavedState !== undefined && obj.unsavedState.saved !== undefined) {
      saved = obj.unsavedState.saved
    } else {
      saved = false
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
  */

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

  get parent() {
    return this.unsavedState.parent
  }

  set parent(parent) {
    this.unsavedState.parent = parent
  }

  get saved() {
    if (this.parent !== undefined) {
      return this.parent.saved
    }
    return false
  }

  set saved(saved) {
    if (this.parent !== undefined) {
      this.parent.saved = saved
    }
  }

  constructor() {
    super()
  }
}

module.exports = {
  BaseObject: BaseObject,
  IncludedBaseObject: IncludedBaseObject
}