import { Validator } from '../utils/validator'
import { User } from './user'
import { PersistentObject } from '../utils/persistent-object'

export enum Role {
    Owner,
    Teacher,
    Writer,
    Student,
    Reader,
    Billing
}

export enum TeamType {
    Working,
    Teaching
}

export interface ITeamMember {
    user?: User
    role?: Role
}

export interface ITeam {
    id?: string
    type?: TeamType
    name?: string
    description?: string
    url?: string
    picture?: string // @TODO
    private?: boolean // @TODO
    created?: Date // @TODO
    createdBy?: User // @TODO
    members?: Array<ITeamMember>
}

export class Team extends PersistentObject {
    protected savedState: ITeam = {}

    get type() {
        return this.savedState.type
    }

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

    get url() {
        return this.savedState.url
    }

    set url(url: string) {
        url = url.trim()
        if (Validator.Url(url)) {
            this.savedState.url = url
            this.saved = false
        }
    }

    get members() {
        return this.savedState.members
    }

    set members(members) {
        this.savedState.members = members
        this.saved = false
    }

    constructor() {
        super()
    }
}