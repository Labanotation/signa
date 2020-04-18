import { Validator } from '../utils/validator'
import { Project } from './project'
import { Score } from './score'
import { Media } from './media'
import { Survey } from './survey'
import { User } from './user'
import { Layout } from './layout'
import { PersistentObject } from '../utils/persistent-object'

// @TODO TYPE ???

export interface IPublication {
    id?: string
    name?: string
    description?: string
    project?: Project // @TODO
    created?: Date // @TODO
    createdBy?: User // @TODO
    revision?: number // @TODO
    score?: {[key:number]: Score} // @TODO
    media?: {[key:number]: Media} // @TODO
    survey?: {[key:number]: Survey} // @TODO
    layout?: Layout // @TODO
}

export class Publication extends PersistentObject {
    protected savedState: IPublication = {}

    get name() {
        return this.savedState.name
    }

    set name(name: string) {
        name = name.trim()
        if (Validator.Title(name)) {
            this.savedState.name = name
            this.saved = false
        }
    }

    get description() {
        return this.savedState.description
    }

    set description(description: string) {
        this.savedState.description = description.trim()
        this.saved = false
    }

    constructor() {
        super()
    }
}