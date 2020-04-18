import { Validator } from '../utils/validator'
import { Project } from './project'
import { User } from './user'
import { PersistentObject } from '../utils/persistent-object'

export interface ISurvey {
    id?: string
    name?: string
    description?: string
    content?: string // @TODO
    project?: Project // @TODO
    created?: Date // @TODO
    createdBy?: User // @TODO
    revision?: number // @TODO
}

export class Survey extends PersistentObject {
    protected savedState: ISurvey = {}

    get name() {
        return this.savedState.name
    }

    set name(name: string) {
        name = name.trim()
        if (Validator.Name(name)) {
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

    get content() {
        return this.savedState.content
    }

    set content(content: string) {
        // @TODO
        this.savedState.content = content
        this.saved = false
    }

    constructor() {
        super()
    }
}