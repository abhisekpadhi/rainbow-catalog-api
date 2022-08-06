// ...
// handy functions to build ONDC response objects
// ...

import {randomUUID} from 'crypto';
import _ from 'lodash';

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

export const generateId = () => Date.now().toString() + Math.floor(Math.random() * 100).toString();

export const makeEntityId = (entity: IEntityType, id?: string) => `${entity}_${id === undefined ? generateId() : id}`;
