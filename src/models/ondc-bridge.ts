import {AuditableSchema, BaseDTO} from './baseDTO';
import {z} from 'zod';

export const OndcSubscriberInfoSchema = AuditableSchema.extend({
    subscriberId: z.string().default(''),
    uniqueKeyId: z.string().default(''),
    details: z.string().default(''),
});

export type IOndcSubscriberInfo = z.infer<typeof OndcSubscriberInfoSchema>;
export class OndcSubscriberInfo extends BaseDTO<IOndcSubscriberInfo> {
    constructor(payload: Partial<IOndcSubscriberInfo>) {
        super(OndcSubscriberInfoSchema.parse(payload));
    }
}
