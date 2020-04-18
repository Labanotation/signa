export class PersistentObject {
    protected savedState: any = {}
    protected unsavedState: any = {}

    get isIncluded() {
        return false
    }

    get id() {
        return this.savedState._id
    }

    set id(id: string) {
        this.savedState._id = id
    }

    get revision() {
        return this.savedState._rev
    }

    set revision(revision: string) {
        this.savedState._rev = revision
    }

    get instanceOf() {
        return this.savedState.instanceOf
    }

    set instanceOf(instanceOf: string) {
        this.savedState.instanceOf = instanceOf
    }

    get saved() {
        return this.unsavedState.saved
    }

    set saved(saved: boolean) {
        this.unsavedState.saved = saved
    }

    get created() {
        return this.savedState.created
    }

    set created(created: Date) {
        this.savedState.created = created
    }

    public dehydrate() {
        return this.savedState
    }

    public rehydrate(obj: any) {

    }

    public async validateSave() {
        return true
    }

    constructor() {

    }
}

export class PersistentIncludedObject extends PersistentObject {
    get isIncluded() {
        return true
    }

    constructor() {
        super()
    }
}