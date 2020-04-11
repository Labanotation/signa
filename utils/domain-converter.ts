export interface Type<T> extends Function {
    new(...args: any[]): T;
}

export class DomainConverter {
    static fromDto<T>(domain: Type<T>, dto: any) {
        const instance = Object.create(domain.prototype);
        instance.savedState = dto;
        instance.unsavedState = {};
        return instance as T;
    }

    static toDto<T>(domain: any) {
        return domain.savedState as T;
    }
}