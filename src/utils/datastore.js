const { v4: uuidv4 } = require('uuid')
const { Models } = require('../models')

const Requests = {
  Objects: 'objects/all',
  ObjectsByName: 'objects/byName',
  ObjectsByClass: 'objects/byClass',
  ObjectsByNameAndClass: 'objects/byNameAndClass',
  ObjectsByCreator: 'objects/createdBy',
  Users: 'users/all',
  UsersRoot: 'users/root',
  UsersByLogin: 'users/byLogin',
  UsersByName: 'users/byName',
  UsersByEmail: 'users/byEmail',
  UsersByOccupation: 'users/byOccupation',
  UsersByCountry: 'users/byCountry',
  Teams: 'teams/all',
  TeamsByName: 'teams/byName',
  TeamsByType: 'teams/byType',
  TeamsByCreator: 'teams/createdBy',
  TeamsByMember: 'teams/byMember',
  TeamsByOwner: 'teams/byOwner',
  Projects: 'projects/all',
  ProjectsByName: 'projects/byName',
  ProjectsByOwner: 'projects/byOwner',
  ProjectsByCreator: 'projects/createdBy',
  Publications: 'publications/all',
  PublicationsByName: 'publications/byName',
  PublicationsByProject: 'publications/byProject',
  PublicationsByCreator: 'publications/createdBy'
}

let _instance = null

class Datastore {

  constructor() {
    this._inited = false
  }

  static getInstance() {
    if (!_instance) {
      _instance = new Datastore()
    }
    return _instance
  }

  get handler() {
    return this._db
  }

  async insert(doc) {
    return await this.handler.insert(doc)
  }

  async get(req) {
    return await this.handler.get(req)
  }

  async view(designname, viewname, params) {
    return await this.handler.view(designname, viewname, params)
  }

  async init() {
    if (this._inited === true) {
      return true
    }
    const nano = require('nano')(`http://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}`)
    this._db = nano.db.use(process.env.DB_NAME)
    try {
      await this.handler.info()
    } catch (ignore) {
      return false
    }
    try {
      await this.handler.insert({
        _id: '_design/objects',
        'views': {
          'all': {
            map: function (doc) {
              if (doc.instanceOf) emit(doc._id)
            }
          },
          'byName': {
            map: function (doc) {
              if (doc.name) emit(doc.name, doc._id)
            }
          },
          'byClass': {
            map: function (doc) {
              if (doc.instanceOf) emit(doc.instanceOf, doc._id)
            }
          },
          'byNameAndClass': {
            map: function (doc) {
              if (doc.name && doc.instanceOf) emit([doc.name, doc.instanceOf], doc._id)
            }
          },
          'createdBy': {
            map: function (doc) {
              if (doc.createdBy) emit(doc.createdBy._id, doc._id)
            }
          }
        }
      })
    } catch (ignore) {
    }
    try {
      await this.handler.insert({
        _id: '_design/users',
        'views': {
          'all': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'User') emit(doc._id)
            }
          },
          'root': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'User' && doc.root === true) emit(doc._id)
            }
          },
          'byLogin': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'User' && doc.login) emit(doc.login, doc._id)
            }
          },
          'byName': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'User' && doc.name) emit(doc.name, doc._id)
            }
          },
          'byEmail': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'User' && doc.email) emit(doc.email, doc._id)
            }
          },
          'byOccupation': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'User' && doc.occupation) emit(doc.occupation, doc._id)
            }
          },
          'byCountry': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'User' && doc.country) emit(doc.country, doc._id)
            }
          }
        }
      })
    } catch (ignore) { }
    try {
      await this.handler.insert({
        _id: '_design/teams',
        'views': {
          'all': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Team') emit(doc._id)
            }
          },
          'byName': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Team' && doc.name) emit(doc.name, doc._id)
            }
          },
          'byType': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Team' && doc.type) emit(doc.type, doc._id)
            }
          },
          'createdBy': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Team' && doc.createdBy) emit(doc.createdBy._id, doc._id)
            }
          },
          'byMember': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Team' && doc.members) {
                for (var member in doc.members) {
                  emit(doc.members[member].user._id, doc._id)
                }
              }
            }
          },
          'byOwner': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Team' && doc.members) {
                for (var member in doc.members) {
                  if (doc.members[member].role === 0) {
                    emit(doc.members[member].user._id, doc._id)
                  }
                }
              }
            }
          }
        }
      })
    } catch (ignore) { }
    try {
      await this.handler.insert({
        _id: '_design/projects',
        'views': {
          'all': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Project') emit(doc._id)
            }
          },
          'byName': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Project' && doc.name) emit(doc.name, doc._id)
            }
          },
          'byOwner': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Project' && doc.owner) emit(doc.owner._id, doc._id)
            }
          },
          'createdBy': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Project' && doc.createdBy) emit(doc.createdBy._id, doc._id)
            }
          }
        }
      })
    } catch (ignore) { }
    try {
      await this.handler.insert({
        _id: '_design/publications',
        'views': {
          'all': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Publication') emit(doc._id)
            }
          },
          'byName': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Publication' && doc.name) emit(doc.name, doc._id)
            }
          },
          'byProject': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Publication' && doc.project) emit(doc.project._id, doc._id)
            }
          },
          'createdBy': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Publication' && doc.createdBy) emit(doc.createdBy._id, doc._id)
            }
          }
        }
      })
    } catch (ignore) { }
    this._inited = true
    return true
  }
}

class DatastoreUtils {
  static cache = new Map()

  static GetUUID() {
    return uuidv4()
  }

  static GetSavedState(key) {
    if (this.cache.has(key)) {
      return this.cache.get(key).saved
    }
    return undefined
  }

  static SetSavedState(key, state) {
    if (this.cache.has(key)) {
      this.cache.get(key).saved = state
    }
  }

  static async Peek(req, key) {
    const result = []
    const viewId = req.split('/')
    const db = Datastore.getInstance()
    const response = await db.view(viewId[0], viewId[1], { key: key, include_docs: false })
    const map = new Map()
    for (const item of response.rows) {
      if (!map.has(item.id)) {
        map.set(item.id, true)
        result.push(item.id)
      }
    }
    return result
  }

  static async PeekOne(req, key) {
    if (key === undefined) {
      const db = Datastore.getInstance()
      try {
        const response = await db.get(req)
        return response
      } catch (ignore) {
        return null
      }
    } else {
      const viewId = req.split('/')
      const db = Datastore.getInstance()
      const response = await db.view(viewId[0], viewId[1], { key: key, include_docs: false })
      if (response.rows.length === 0) {
        return null
      }
      return response.rows[0].id
    }
  }

  static async Load(req, key) {
    const result = []
    const viewId = req.split('/')
    const db = Datastore.getInstance()
    const response = await db.view(viewId[0], viewId[1], { key: key, include_docs: true })
    const map = new Map()
    for (const item of response.rows) {
      if (!map.has(item.id)) {
        map.set(item.id, true)
        if (this.cache.has(item.id)) {
          if (this.GetSavedState(item.id) === true) {
            result.push(this.cache.get(item.id))
          } else {
            this.cache.delete(item.id)
            result.push(this.Rehydrate(item.doc))
            this.SetSavedState(item.id, true)
          }
        } else {
          result.push(this.Rehydrate(item.doc))
          this.SetSavedState(item.id, true)
        }
      }
    }
    return result
  }

  static async LoadOne(req, key) {
    if (key === undefined) {
      const db = Datastore.getInstance()
      try {
        const item = await db.get(req)
        if (this.cache.has(item._id)) {
          if (this.GetSavedState(item._id) === true) {
            return this.cache.get(item._id)
          }
          this.cache.delete(item._id)
        }
        const result = this.Rehydrate(item)
        this.SetSavedState(item._id, true)
        return result
      } catch (ignore) {
        return null
      }
    } else {
      const viewId = req.split('/')
      const db = Datastore.getInstance()
      const response = await db.view(viewId[0], viewId[1], { key: key, include_docs: true })
      if (response.rows.length === 0) {
        return null
      }
      const item = response.rows[0]
      if (this.cache.has(item.id)) {
        if (this.GetSavedState(item.id) === true) {
          return this.cache.get(item.id)
        }
        this.cache.delete(item.id)
      }
      const result = this.Rehydrate(item.doc)
      this.SetSavedState(item.id, true)
      return result
    }
  }

  static Rehydrate(data, sandboxed, cache) {
    if (sandboxed === undefined) {
      sandboxed = false
    }
    if (cache === undefined) {
      cache = new Map()
    }
    if (!data) {
      return data
    }
    if (data._id !== undefined) {
      if (sandboxed === true && cache.has(data._id) === true) {
        return cache.get(data._id)
      }
      if (sandboxed === false && this.cache.has(data._id) === true) {
        return this.cache.get(data._id)
      }
    }
    let rehydratedObj
    if (data.instanceOf !== undefined) {
      rehydratedObj = new Models[data.instanceOf]()
      rehydratedObj.rehydrate(data)
    } else {
      rehydratedObj = {}
    }
    if (sandboxed === true && data._id !== undefined) {
      cache.set(data._id, rehydratedObj)
    } else if (sandboxed === false && data._id !== undefined) {
      this.cache.set(data._id, rehydratedObj)
    }
    for (const key in data) {
      switch (key) {
        case '_included':
          delete data[key]
          break
        case '_id':
          rehydratedObj.id = data[key]
          break
        case '_rev':
          rehydratedObj.revision = data[key]
          break
        default:
          if (Array.isArray(data[key])) {
            rehydratedObj[key] = []
            for (const element of data[key]) {
              rehydratedObj[key].push(this.Rehydrate(element, sandboxed, cache))
            }
          } else if (data[key] instanceof Object && data[key].constructor === Object) {
            rehydratedObj[key] = this.Rehydrate(data[key], sandboxed, cache)
          } else {
            rehydratedObj[key] = data[key]
          }
      }
    }
    return rehydratedObj
  }

  static async Save(obj) {
    let validateSave = true
    if (typeof obj.validateSave === 'function') {
      validateSave = await obj.validateSave()
    }
    const responses = []
    if (validateSave === true) {
      const db = Datastore.getInstance()
      const data = this.Dehydrate(obj)
      const [, documents] = this.expand(data)
      for (const [, doc] of documents) {
        if (doc._id && !doc._rev) {
          doc.created = new Date()
          if (this.cache.has(doc._id)) {
            this.cache.get(doc._id).created = doc.created
          }
          if (doc._id === obj.id) {
            obj.created = doc.created
          }
        }
        const resp = await db.insert(doc)
        if (resp.ok && resp.id && resp.rev) {
          if (this.cache.has(resp.id)) {
            this.cache.get(resp.id).revision = resp.rev
            this.SetSavedState(resp.id, true)
          }
          if (resp.id === obj.id) {
            obj.revision = resp.rev
            obj.saved = true
          }
        } else if (resp.id) {
          this.SetSavedState(resp.id, false)
          if (resp.id === obj.id) {
            obj.saved = false
          }
        }
        responses.push(resp)
      }
    } else {
      responses.push({
        ok: false,
        id: obj.id,
        rev: obj.revision
      })
    }
    return responses
  }

  static Dehydrate(obj) {
    let temp
    let dehydratedObj
    if (obj instanceof Models.BaseObject) {
      if (obj.id === undefined) {
        obj.id = this.GetUUID()
      }
      if (obj.instanceOf === undefined) {
        obj.instanceOf = obj.constructor.name
      }
      temp = Object.assign({}, obj.dehydrate())
      temp._included = obj.isIncluded
    } else {
      temp = obj
    }
    if (Array.isArray(temp)) {
      dehydratedObj = []
      for (const element of temp) {
        dehydratedObj.push(this.Dehydrate(element))
      }
    } else if (temp instanceof Object && temp.constructor === Object) {
      dehydratedObj = {}
      for (const element in temp) {
        dehydratedObj[element] = this.Dehydrate(temp[element])
      }
    } else {
      dehydratedObj = temp
    }
    return dehydratedObj
  }

  static expand(obj, documents, root) {
    if (documents === undefined) {
      documents = new Map()
    }
    if (root === undefined) {
      root = true
    }
    let property = undefined
    let prop
    if (Array.isArray(obj)) {
      property = []
      for (const element of obj) {
        [prop, documents] = this.expand(element, documents, false)
        property.push(prop)
      }
    } else if (obj instanceof Object && obj.constructor === Object) {
      if (obj._id !== undefined && obj._included === false && root !== true) {
        property = {
          _id: obj._id
        }
        if (obj.instanceOf !== undefined) {
          property.instanceOf = obj.instanceOf
        }
        let doc = {}
        for (const key in obj) {
          switch (key) {
            case '_included':
              break
            default:
              [prop, documents] = this.expand(obj[key], documents, false)
              doc[key] = prop
          }
        }
        if (obj._id !== undefined) {
          documents.set(obj._id, doc)
        }
      } else {
        property = {}
        for (const key in obj) {
          switch (key) {
            case '_included':
              if (root !== true) { // @FIXME
                property[key] = obj[key]
              }
              break
            default:
              [prop, documents] = this.expand(obj[key], documents, false)
              property[key] = prop
          }
        }
        if (obj._id !== undefined && obj._included === false) {
          documents.set(obj._id, property)
        }
      }
    } else {
      property = obj
    }
    return [property, documents]
  }
}

module.exports = {
  Datastore: Datastore,
  DatastoreUtils: DatastoreUtils,
  Requests: Requests
}