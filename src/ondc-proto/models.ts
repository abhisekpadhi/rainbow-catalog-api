import {z} from 'zod'
import dayjs from 'dayjs';
import {BaseDTO} from '../models/baseDTO';
import {randomUUID} from 'crypto';


export enum SYSTEM_ROLES {
    SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum EMAIL_TEMPLATES {
    FORGOT_PASSWORD = 'FORGOT_PASSWORD',
    SIGN_UP = 'SIGN_UP',
    REGISTER = 'REGISTER',
    RESEND_OTP = 'RESEND_OTP',
    WELCOME = 'WELCOME',
    RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS',
    INVITE = 'INVITE',
    USER_ACTIVITY = 'USER_ACTIVITY',
    EXCEPTION = 'EXCEPTION',
    EVENT_UPDATE = 'EVENT_UPDATE',
    EVENT_CANCEL = 'EVENT_CANCEL',
    ORDER_BOOKED = 'ORDER_BOOKED',
    ORDER_CANCEL = 'ORDER_CANCEL'
}

export enum RESOURCE_POSSESSION {
    OWN = 'OWN',
    ANY = 'ANY',
    SUB = 'SUB'
}

export enum HEADERS {
    ACCESS_TOKEN = 'access-token',
    AUTH_TOKEN = 'Authorization',
}

export enum PAYMENT_TYPES {
    "ON-ORDER" = "ON-ORDER",
    "PRE-FULFILLMENT" = "PRE-FULFILLMENT",
    "ON-FULFILLMENT" = "ON-FULFILLMENT",
    "POST-FULFILLMENT" = "POST-FULFILLMENT"
}

export enum PROTOCOL_CONTEXT {
    CANCEL = "cancel",
    ON_CANCEL = "on_cancel",
    CONFIRM = "confirm",
    ON_CONFIRM = "on_confirm",
    INIT = "init",
    ON_INIT = "on_init",
    SEARCH = "search",
    ON_SEARCH = "on_search",
    TRACK = "track",
    ON_TRACK = "on_track",
    SUPPORT = "support",
    ON_SUPPORT = "on_support",
    STATUS = "status",
    ON_STATUS = "on_status",
    SELECT = "select",
    ON_SELECT = "on_select",
    UPDATE = "update",
    ON_UPDATE = "on_update",
    RATING = "rating",
    ON_RATING = "on_rating",
}

export enum PROTOCOL_PAYMENT {
    PAID = "PAID",
    "NOT-PAID" = "NOT-PAID",
}

export enum PROTOCOL_VERSION {
    v_0_9_1 = "0.9.1",
    v_0_9_3 = "0.9.3"
}

export enum SUBSCRIBER_TYPE {
    BAP = "BAP",
    BPP = "BPP",
    BG = "BG",
    LREG = "LREG",
    CREG = "CREG",
    RREG = "RREG"
}

export enum ORDER_STATUS {
    COMPLETED = "completed",
    "IN-PROGRESS" = "in-progress"
}

export const SubscriberItemInLookupResponseSchema = z.object({
    br_id: z.number().default(0),
    subscriber_id: z.string().default(''),
    subscriber_url: z.string().default(''),
    type: z.enum(['BPP', 'BAP', 'BG', 'LREG', 'CREG', 'RREG']),
    domain: z.string().default('nic2004:52110'),
    city: z.string().default('*'),
    country: z.string().default('IND'),
    signing_public_key: z.string().default(''),
    encr_public_key: z.string().default(''),
    valid_from: z.string().default(''), // TZ date time
    valid_until: z.string().default(''),
    status: z.string().default(''), // SUBSCRIBED
    created: z.string().default(''), // TZ date time
    updated: z.string().default(''), // TZ date time
    ukId: z.string().default(''), // uniqueKeyId
});

export type ISubscriberItemInLookupResponse = z.infer<typeof SubscriberItemInLookupResponseSchema>;
export class SubscriberItemInLookupResponse extends BaseDTO<ISubscriberItemInLookupResponse> {
    constructor(payload: Partial<ISubscriberItemInLookupResponse>) {
        super(SubscriberItemInLookupResponseSchema.parse(payload));
    }
}

export type ILookupResponse = ISubscriberItemInLookupResponse[];

/**
 * {
 *   keyId: 'example-bg.com|bg3456|ed25519',
 *   algorithm: 'ed25519',
 *   created: '1641287885',
 *   expires: '1641287885',
 *   headers: '(created) (expires) digest',
 *   signature: 'hJ5sCmbe7s9Wateq6QAdBGloVSkLuLHWOXcRkzrMcVLthFldV4gnT9Vrnq9iDNPVSKuDqaercVjQwFlj0Ml+3Q=='
 * }
 */
export const AuthHeaderPartsSchema = z.object({
    keyId: z.string().default(''), // Example: 'example-bg.com|bg3456|ed25519'
    algorithm: z.string().default(''),
    created: z.string().default(dayjs().unix().toString()), // epoch in seconds
    expires: z.string().default(dayjs().add(1, 'hour').unix().toString()), // epoch in seconds
    headers: z.string().default('(created) (expires) digest'),
    signature: z.string().default(''),
})
export type IAuthHeaderParts = z.infer<typeof AuthHeaderPartsSchema>
export class AuthHeaderParts extends BaseDTO<IAuthHeaderParts> {
    constructor(payload: Partial<IAuthHeaderParts>) {
        super(AuthHeaderPartsSchema.parse(payload));
    }
}

/**
 * {
 *         "domain": "nic2004:52110",
 *         "country": "IND",
 *         "city": "std:080",
 *         "action": "search",
 *         "core_version": "0.9.3-draft",
 *         "bap_id": "bap.com",
 *         "bap_uri": "https://bap.com/beckn",
 *         "bpp_id": "bpp.com",
 *         "bpp_uri": "https://bpp.com/beckn",
 *         "transaction_id": "example_transaction_id",
 *         "message_id": "example_message_id",
 *         "timestamp": "2021-06-23T07:59:13.950Z"
 *     }
 */
export const OndcPayloadContextSchema = z.object({
    domain: z.string().default(process.env.DOMAIN!),
    country: z.string().default(process.env.COUNTRY!),
    city : z.string().default(process.env.CITY!),
    action : z.nativeEnum(PROTOCOL_CONTEXT),
    core_version : z.string().default(PROTOCOL_VERSION.v_0_9_3),
    bap_id : z.string().default(''),
    bap_uri : z.string().default(''),
    bpp_id : z.string().default(process.env.BPP_ID!),
    bpp_uri : z.string().default(process.env.BPP_URI!),
    transaction_id : z.string().default(randomUUID()),
    message_id : z.string().default(randomUUID()),
    timestamp: z.date().default(new Date()),
});

export type IOndcPayloadContext = z.infer<typeof OndcPayloadContextSchema>;

export class OndcPayloadContext extends BaseDTO<IOndcPayloadContext> {
    constructor(payload:
                    Pick<IOndcPayloadContext, 'action' | 'bap_id' | 'bpp_id'>
                    & Omit<Partial<IOndcPayloadContext>, 'action' | 'bap_id' | 'bpp_id'>) {
        super(OndcPayloadContextSchema.parse(payload));
    }
}

export const _paymentResponse = {
    "type": "ON-FULFILLMENT",
    "status": "NOT-PAID"
}
