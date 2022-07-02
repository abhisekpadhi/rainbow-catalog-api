// This is an example model.
// Theory: An entity is based on type which is inferred from a schema.

import {z} from 'zod';
import {AuditableSchema, BaseDTO} from './baseDTO';

// Schema
// Extending AuditableSchema is optional.
export const ExampleSchema = AuditableSchema.extend({
    key: z.string().max(10).default(''),
});

// If not extending, use z.object
export const ExampleSchema1 = z.object({
    key: z.string().max(10).default(''),
});

// Type
export type IExample = z.infer<typeof ExampleSchema>;

// Entity
export class Example extends BaseDTO<IExample>{
    constructor(init: Partial<IExample>) {
        super(ExampleSchema.parse(init));
    }
}
