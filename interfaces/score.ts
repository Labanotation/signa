/*
Table score as S {
    type int
    author string
    notator string
    genre string
    tags string
    revision int
}
*/

import { Validator } from '../utils/validator'
import { Project } from './project'
import { User } from './user'
import { PersistentObject } from '../utils/persistent-object'

export interface IScore {
    id?: string
    name?: string
    description?: string
    project?: Project // @TODO
    status?: number // @TODO
    created?: Date // @TODO
    createdBy?: User // @TODO
    revision?: number // @TODO
    locked?: boolean // @TODO
}

export class Score extends PersistentObject {
    protected savedState: IScore = {}

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