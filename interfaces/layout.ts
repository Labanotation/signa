import { Validator } from '../utils/validator';
import { PersistentObject } from '../utils/persistent-object';

export interface ILayout {
    id?: string;
    name?: string;
    description?: string;
    // @TODO
}

export class Layout extends PersistentObject {
    protected savedState: ILayout = {};

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

    constructor() {
        super();
    }
}