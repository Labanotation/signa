import { Validator } from '../utils/validator';
import { Project } from './project';
import { User } from './user';
import { PersistentObject } from '../utils/persistent-object';

export enum Type {
    Image,
    Video,
    Audio,
    Music,
    Text,
    Application
}
// others (web): example, message, model, multipart

export interface IMedia {
    id?: string;
    name?: string;
    description?: string;
    type?: Type;
    content?: string; // @TODO
    project?: Project; // @TODO
    created?: Date; // @TODO
    createdBy?: User; // @TODO
    revision?: number; // @TODO
}

export class Media extends PersistentObject {
    protected savedState: IMedia = {};

    get name() {
        return this.savedState.name;
    }

    set name(name: string) {
        name = name.trim();
        if (Validator.Name(name)) {
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

    get type() {
        return this.savedState.type;
    }

    get content() {
        return this.savedState.content;
    }

    set content(content: string) {
        switch (this.type) {
            case Type.Image:
            case Type.Video:
            case Type.Audio:
                content = content.trim();
                if (Validator.Path(content)) {
                    this.savedState.content = content;
                    this.saved = false;
                }
                break;
            case Type.Music:
            case Type.Text:
            case Type.Application:
            default:
                // @TODO
                this.savedState.content = content;
                this.saved = false;
                break;
        }

    }

    constructor() {
        super();
    }
}