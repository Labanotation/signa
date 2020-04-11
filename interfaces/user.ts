import { Validator } from '../utils/validator';
import { PersistentObject } from '../utils/persistent-object';
import { Requests, PersistentObjectUtils } from '../utils/persistent-object-utils';
import * as argon2 from 'argon2';

export interface IUser {
    id?: string;
    login?: string;
    name?: string;
    email?: string;
    description?: string;
    url?: string;
    picture?: string; // @TODO
    occupation?: number; // @TODO
    country?: number; // @TODO
    status?: number; // @TODO
    private?: boolean; // @TODO
    verified?: boolean; // @TODO
    created?: Date; // @TODO
    password?: string;
    root?: boolean;
}

/* @TODO for occupation, etc.
enum Direction {
    Up = 1,
    Down,
    Left,
    Right,
}
*/

export class User extends PersistentObject {
    protected savedState: IUser = {};

    /*
    public serialize() {
        return DomainConverter.toDto<User>(this);
    }
    */

    get login() {
        return this.savedState.login;
    }

    set login(login: string) {
        login = login.trim();
        if (Validator.Login(login)) {
            this.savedState.login = login;
            this.saved = false;
        }
    }

    get password() {
        return this.savedState.password;
    }

    set password(hashedPassword: string) {
        this.savedState.password = hashedPassword;
        this.saved = false;
    }

    static async hashPassword (password: string) {
        return await argon2.hash(password);
    }

    static async verifyPassword (password: string, hashedPassword: string) {
        return await argon2.verify(hashedPassword, password);
    }

    async verifyPassword (password: string) {
        return await argon2.verify(this.password, password);
    }

    public async validateSave() {
        const existingUserByLogin = await PersistentObjectUtils.Peek(Requests.UsersByLogin, this.login);
        const existingUserByEmail = await PersistentObjectUtils.Peek(Requests.UsersByEmail, this.email);
        if (this.root) {
            const existingUserRoot = await PersistentObjectUtils.Peek(Requests.UsersRoot);
            return existingUserByLogin.length === 0 && existingUserByEmail.length === 0 && existingUserRoot.length === 0;
        }
        return existingUserByLogin.length === 0 && existingUserByEmail.length === 0;
    }

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

    get email() {
        return this.savedState.email;
    }

    set email(email: string) {
        email = email.trim();
        if (Validator.Email(email)) {
            this.savedState.email = email;
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

    get url() {
        return this.savedState.url;
    }

    set url(url: string) {
        url = url.trim();
        if (Validator.Url(url)) {
            this.savedState.url = url;
            this.saved = false;
        }
    }

    get root() {
        return this.savedState.root;
    }

    set root(root: boolean) {
        this.savedState.root = root;
    }

    get verified() {
        return this.savedState.verified;
    }

    set verified(verified: boolean) {
        this.savedState.verified = verified;
    }

    constructor() {
        super();
    }
}