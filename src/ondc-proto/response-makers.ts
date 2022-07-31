// ...
// handy functions to build ONDC response objects
// ...

import {randomUUID} from 'crypto';

export const makeAck = (ack = true, contextError?: {code: string, path: string, message: string}) => {
    const res: Partial<{message: any, error: any}> = {
        "message": {
            "ack": {
                "status": (contextError || !ack) ? "NACK" : "ACK"
            }
        },
    }
    if (contextError !== undefined) {
        res['error'] = {
            "type": "CONTEXT-ERROR",
            ...contextError
        }
    }
    return res;
}

export type IEntityType = 'provider' | 'loc' | 'fulfillment' | 'item' | 'payment' | 'billing' | 'order';

export const generateId = () => randomUUID().replaceAll('-', '');

export const makeEntityId = (entity: IEntityType, id?: string) => `${entity}_${id === undefined ? generateId() : id}`;
