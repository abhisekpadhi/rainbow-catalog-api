import { z } from 'zod';

export interface IBase<T> {
    readonly data: T | undefined;
    toPlainObject: () => T | undefined;
}

export class BaseDTO<T> implements IBase<T>{
    public readonly data: T | undefined;
    constructor(init: T) { this.data = init; }
    toPlainObject = () => _toObject(this.data);
    toJSON = () => JSON.stringify(this.toPlainObject());
}

const _toObject = <T>(data: T): T => {
    const obj: {[k: string]: any} = {};
    Object.getOwnPropertyNames(data).forEach(key => obj[key] = (data as any)[key])
    return obj as T;
}

export const AuditableSchema = z.object({
    id: z.number().optional().default(0),
    createdAt: z.number().default(Date.now),
    currentActive: z.boolean().default(true),
});
