const { v4: uuidv4 } = require('uuid')
const { Models } = require('../models')

const Requests = {
  Objects: 'objects/all',
  ObjectsIndexable: 'objects/indexable',
  ObjectsPublic: 'objects/public',
  ObjectsByName: 'objects/byName',
  ObjectsByLang: 'objects/byLang',
  ObjectsByClass: 'objects/byClass',
  ObjectsByNameAndClass: 'objects/byNameAndClass',
  ObjectsByCreator: 'objects/createdBy',
  ObjectsByProject: 'objects/byProject',
  Users: 'users/all',
  UsersRoot: 'users/root',
  UsersIndexable: 'users/indexable',
  UsersPublic: 'users/public',
  UsersByLogin: 'users/byLogin',
  UsersByName: 'users/byName',
  UsersByEmail: 'users/byEmail',
  UsersByOccupation: 'users/byOccupation',
  UsersByCountry: 'users/byCountry',
  UsersByLang: 'users/byLang',
  Teams: 'teams/all',
  TeamsIndexable: 'teams/indexable',
  TeamsPublic: 'teams/public',
  TeamsByName: 'teams/byName',
  TeamsByType: 'teams/byType',
  TeamsByCreator: 'teams/createdBy',
  TeamsByMember: 'teams/byMember',
  TeamsByOwner: 'teams/byOwner',
  Surveys: 'surveys/all',
  SurveysIndexable: 'surveys/indexable',
  SurveysPublic: 'surveys/public',
  SurveysByName: 'surveys/byName',
  SurveysByLang: 'surveys/byLang',
  SurveysByCreator: 'surveys/createdBy',
  SurveysByProject: 'surveys/byProject',
  Scores: 'scores/all',
  ScoresIndexable: 'scores/indexable',
  ScoresPublic: 'scores/public',
  ScoresByName: 'scores/byName',
  ScoresByLang: 'scores/byLang',
  ScoresByCreator: 'scores/createdBy',
  ScoresByProject: 'scores/byProject',
  ScoresByType: 'scores/byType',
  ScoresByAuthor: 'scores/byAuthor',
  ScoresByNotator: 'scores/byNotator',
  ScoresByGenre: 'scores/byGenre',
  ScoresByTag: 'scores/byTag',
  Publications: 'publications/all',
  PublicationsIndexable: 'publications/indexable',
  PublicationsPublic: 'publications/public',
  PublicationsByName: 'publications/byName',
  PublicationsByLang: 'publications/byLang',
  PublicationsByCreator: 'publications/createdBy',
  PublicationsByProject: 'publications/byProject',
  Projects: 'projects/all',
  ProjectsIndexable: 'projects/indexable',
  ProjectsPublic: 'projects/public',
  ProjectsByName: 'projects/byName',
  ProjectsByLang: 'projects/byLang',
  ProjectsByOwner: 'projects/byOwner',
  ProjectsByContributor: 'projects/byContributor',
  ProjectsByCreator: 'projects/createdBy',
  Discussions: 'discussions/all',
  DiscussionsIndexable: 'discussions/indexable',
  DiscussionsPublic: 'discussions/public',
  DiscussionsByTitle: 'discussions/byTitle',
  DiscussionsByCreator: 'discussions/createdBy',
  DiscussionsByProject: 'discussions/byProject',
  Media: 'media/all',
  MediaIndexable: 'media/indexable',
  MediaPublic: 'media/public',
  MediaByName: 'media/byName',
  MediaByLang: 'media/byLang',
  MediaByCreator: 'media/createdBy',
  MediaByProject: 'media/byProject',
  MediaByType: 'media/byType',
  Layouts: 'layouts/all',
  LayoutsPublic: 'layouts/public',
  LayoutsByName: 'layouts/byName',
  LayoutsByCreator: 'layouts/createdBy',
  LayoutsByProject: 'layouts/byProject'
}

let _instance = undefined

class Datastore {

  constructor() {
    this._inited = false
  }

  static getInstance() {
    if (_instance === undefined) {
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
          'indexable': {
            map: function (doc) {
              if (doc.instanceOf && doc.indexable === true) emit(doc._id)
            }
          },
          'public': {
            map: function (doc) {
              if (doc.instanceOf && doc.priv === false) emit(doc._id)
            }
          },
          'byName': {
            map: function (doc) {
              if (doc.instanceOf && doc.name) emit(doc.name, doc._id)
            }
          },
          'byLang': {
            map: function (doc) {
              if (doc.instanceOf && doc.lang) emit(doc.lang, doc._id)
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
              if (doc.instanceOf && doc.createdBy) emit(doc.createdBy._id, doc._id)
            }
          },
          'byProject': {
            map: function (doc) {
              if (doc.instanceOf && doc.project) emit(doc.project._id, doc._id)
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
          'indexable': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'User' && doc.indexable === true) emit(doc._id)
            }
          },
          'public': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'User' && doc.priv === false) emit(doc._id)
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
          },
          'byLang': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'User' && doc.lang) emit(doc.lang, doc._id)
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
          'indexable': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Team' && doc.indexable === true) emit(doc._id)
            }
          },
          'public': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Team' && doc.priv === false) emit(doc._id)
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
        _id: '_design/surveys',
        'views': {
          'all': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Survey') emit(doc._id)
            }
          },
          'indexable': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Survey' && doc.indexable === true) emit(doc._id)
            }
          },
          'public': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Survey' && doc.priv === false) emit(doc._id)
            }
          },
          'byName': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Survey' && doc.name) emit(doc.name, doc._id)
            }
          },
          'byLang': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Survey' && doc.lang) emit(doc.lang, doc._id)
            }
          },
          'createdBy': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Survey' && doc.createdBy) emit(doc.createdBy._id, doc._id)
            }
          },
          'byProject': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Survey' && doc.project) emit(doc.project._id, doc._id)
            }
          }
        }
      })
    } catch (ignore) { }
    try {
      await this.handler.insert({
        _id: '_design/scores',
        'views': {
          'all': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Score') emit(doc._id)
            }
          },
          'indexable': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Score' && doc.indexable === true) emit(doc._id)
            }
          },
          'public': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Score' && doc.priv === false) emit(doc._id)
            }
          },
          'byName': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Score' && doc.name) emit(doc.name, doc._id)
            }
          },
          'byLang': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Score' && doc.lang) emit(doc.lang, doc._id)
            }
          },
          'createdBy': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Score' && doc.createdBy) emit(doc.createdBy._id, doc._id)
            }
          },
          'byProject': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Score' && doc.project) emit(doc.project._id, doc._id)
            }
          },
          'byType': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Score' && doc.type) emit(doc.type, doc._id)
            }
          },
          'byAuthor': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Score' && doc.authors) {
                for (var author of doc.authors) {
                  emit(author, doc._id)
                }
              }
            }
          },
          'byNotator': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Score' && doc.notators) {
                for (var notator of doc.notators) {
                  emit(notator, doc._id)
                }
              }
            }
          },
          'byGenre': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Score' && doc.genres) {
                for (var genre of doc.genres) {
                  emit(genre, doc._id)
                }
              }
            }
          },
          'byTag': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Score' && doc.tags) {
                for (var tag of doc.tags) {
                  emit(tag, doc._id)
                }
              }
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
          'indexable': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Publication' && doc.indexable === true) emit(doc._id)
            }
          },
          'public': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Publication' && doc.priv === false) emit(doc._id)
            }
          },
          'byName': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Publication' && doc.name) emit(doc.name, doc._id)
            }
          },
          'byLang': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Publication' && doc.lang) emit(doc.lang, doc._id)
            }
          },
          'createdBy': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Publication' && doc.createdBy) emit(doc.createdBy._id, doc._id)
            }
          },
          'byProject': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Publication' && doc.project) emit(doc.project._id, doc._id)
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
          'indexable': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Project' && doc.indexable === true) emit(doc._id)
            }
          },
          'public': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Project' && doc.priv === false) emit(doc._id)
            }
          },
          'byName': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Project' && doc.name) emit(doc.name, doc._id)
            }
          },
          'byLang': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Project' && doc.lang) emit(doc.lang, doc._id)
            }
          },
          'byOwner': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Project' && doc.owner) emit(doc.owner._id, doc._id)
            }
          },
          'byContributor': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Project' && doc.contributors) {
                for (var contributor of doc.contributors) {
                  emit(contributor._id, doc._id)
                }
              }
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
        _id: '_design/discussions',
        'views': {
          'all': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Discussion') emit(doc._id)
            }
          },
          'indexable': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Discussion' && doc.indexable === true) emit(doc._id)
            }
          },
          'public': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Discussion' && doc.priv === false) emit(doc._id)
            }
          },
          'byTitle': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Discussion' && doc.title) emit(doc.title, doc._id)
            }
          },
          'createdBy': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Discussion' && doc.createdBy) emit(doc.createdBy._id, doc._id)
            }
          },
          'byProject': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Discussion' && doc.project) emit(doc.project._id, doc._id)
            }
          }
        }
      })
    } catch (ignore) { }
    try {
      await this.handler.insert({
        _id: '_design/media',
        'views': {
          'all': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Media') emit(doc._id)
            }
          },
          'indexable': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Media' && doc.indexable === true) emit(doc._id)
            }
          },
          'public': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Media' && doc.priv === false) emit(doc._id)
            }
          },
          'byName': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Media' && doc.name) emit(doc.name, doc._id)
            }
          },
          'byLang': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Media' && doc.lang) emit(doc.lang, doc._id)
            }
          },
          'createdBy': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Media' && doc.createdBy) emit(doc.createdBy._id, doc._id)
            }
          },
          'byProject': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Media' && doc.project) emit(doc.project._id, doc._id)
            }
          },
          'byType': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Media' && doc.type) emit(doc.type, doc._id)
            }
          }
        }
      })
    } catch (ignore) { }
    try {
      await this.handler.insert({
        _id: '_design/layouts',
        'views': {
          'all': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Layout') emit(doc._id)
            }
          },
          'public': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Layout' && doc.priv === false) emit(doc._id)
            }
          },
          'byName': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Layout' && doc.name) emit(doc.name, doc._id)
            }
          },
          'createdBy': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Layout' && doc.createdBy) emit(doc.createdBy._id, doc._id)
            }
          },
          'byProject': {
            map: function (doc) {
              if (doc.instanceOf && doc.instanceOf === 'Layout' && doc.project) emit(doc.project._id, doc._id)
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
        return undefined
      }
    } else {
      const viewId = req.split('/')
      const db = Datastore.getInstance()
      const response = await db.view(viewId[0], viewId[1], { key: key, include_docs: false })
      if (response.rows.length === 0) {
        return undefined
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
            result.push(await this.Rehydrate(item.doc))
          }
        } else {
          result.push(await this.Rehydrate(item.doc))
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
        const result = await this.Rehydrate(item)
        return result
      } catch (ignore) {
        return undefined
      }
    } else {
      const viewId = req.split('/')
      const db = Datastore.getInstance()
      const response = await db.view(viewId[0], viewId[1], { key: key, include_docs: true })
      if (response.rows.length === 0) {
        return undefined
      }
      const item = response.rows[0]
      if (this.cache.has(item.id)) {
        if (this.GetSavedState(item.id) === true) {
          return this.cache.get(item.id)
        }
        this.cache.delete(item.id)
      }
      const result = await this.Rehydrate(item.doc)
      return result
    }
  }

  static async Rehydrate(data, sandboxed, cache, sub) {
    if (sandboxed === undefined) {
      sandboxed = false
    }
    if (cache === undefined) {
      cache = new Map()
    }
    if (sub === undefined) {
      sub = false
    }
    if (!data) {
      return data
    }
    if (data._id !== undefined) {
      if (sandboxed === true && cache.has(data._id) === true) {
        return cache.get(data._id)
      }
      if (sandboxed === false && this.cache.has(data._id) === true) {
        this.SetSavedState(data._id, true)
        return this.cache.get(data._id)
      }
    }
    let rehydratedObj
    let skip = false
    if (data.instanceOf !== undefined) {
      rehydratedObj = new Models[data.instanceOf]()
      if (rehydratedObj instanceof Models.BaseObject === true && rehydratedObj instanceof Models.IncludedBaseObject === false && data._id && sub === true) {
        rehydratedObj = await this.LoadOne(data._id)
        skip = true
      } else {
        rehydratedObj.rehydrate(data)
      }
    } else {
      rehydratedObj = {}
    }
    if (sandboxed === true && data._id !== undefined) {
      cache.set(data._id, rehydratedObj)
    } else if (sandboxed === false && data._id !== undefined) {
      this.cache.set(data._id, rehydratedObj)
    }
    if (skip === false) {
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
              if (rehydratedObj instanceof Models.BaseObject) {
                for (const element of data[key]) {
                  rehydratedObj.add(key, await this.Rehydrate(element, sandboxed, cache, true))
                }
              } else {
                rehydratedObj[key] = []
                for (const element of data[key]) {
                  rehydratedObj[key].push(await this.Rehydrate(element, sandboxed, cache, true))
                }
              }
            } else if (data[key] instanceof Object && data[key].constructor === Object) {
              if (rehydratedObj instanceof Models.BaseObject) {
                rehydratedObj.set(key, await this.Rehydrate(data[key], sandboxed, cache, true))
              } else {
                rehydratedObj[key] = await this.Rehydrate(data[key], sandboxed, cache, true)
              }
            } else {
              if (rehydratedObj instanceof Models.BaseObject) {
                rehydratedObj.set(key, data[key])
              } else {
                rehydratedObj[key] = data[key]
              }
            }
        }
      }
    }
    rehydratedObj.saved = true
    if (sandboxed === false && data._id !== undefined) {
      this.SetSavedState(data._id, true)
    }
    return rehydratedObj
  }

  static async Save(obj) {
    let responses = []
    if (obj.saved === true && obj.id && obj.revision) {
      responses.push({
        ok: true,
        id: obj.id,
        rev: obj.revision
      })
      for (const item of obj.allSeparateChildren) {
        responses = responses.concat(await this.Save(item))
      }
      return responses
    }
    let validateSave = true
    if (typeof obj.validateSave === 'function') {
      validateSave = await obj.validateSave()
    }
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