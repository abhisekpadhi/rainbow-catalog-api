// ...
// handy functions to build ONDC response objects
// ...

import {generateRandomNDigits} from '../common/lib/jwt';

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

/**
 * so: Seller order
 */
export type IEntityType = 'provider' | 'loc' | 'fulfillment' | 'item' | 'payment' | 'billing' | 'order' | 'so';


// export const generateId = () => _.replace(randomUUID(), /-/g, '');

export const generateId = () => Date.now().toString() + generateRandomNDigits(2);

export const makeEntityId = (entity: IEntityType, id?: string) => `${entity}_${id === undefined ? generateId() : id}`;
