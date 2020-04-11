import { Validator } from '../utils/validator';
import { User } from './user';
import { Team } from './team';
import { PersistentObject } from '../utils/persistent-object';

export interface IProject {
    id?: string;
    name?: string;
    description?: string;
    picture?: string; // @TODO
    owner?: User | Team;
    status?: number; // @TODO
    private?: boolean; // @TODO
    created?: Date; // @TODO
    createdBy?: User; // @TODO
}

export class Project extends PersistentObject {
    protected savedState: IProject = {};

    get name() {
        return this.savedState.name;
    }

    set name(name: string) {
        name = name.trim();
        if (Validator.Title(name)) {
            this.savedState.name = name;
            this.saved = false;
        }
    }

    get description() {
        return this.savedState.description;
    }

    set description(description: string) {
        this.savedState.description = description.trim();
        this.saved = false;
    }

    get owner() {
        return this.savedState.owner;
    }

    constructor() {
        super();
    }
}