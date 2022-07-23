import {cache} from '../clients';
import {CONSTANTS} from '../../CONSTANTS';

interface ITaskQ {
    enqueue: (payload: string, qname?: string) => void;
    dequeue: (qname?: string) => Promise<string | null>;
}

class OndcTaskQRedisImpl implements ITaskQ {
    private readonly qname = CONSTANTS.ondcRequestRedisList;
    private readonly chname = CONSTANTS.ondcRequestRedisChannel
    enqueue = async (payload: string) => {
        // add task to redis list
        await cache.lPush(this.qname, payload)
        // publish message to redis pubsub
        await cache.publish(this.chname, '');
    }
    dequeue = async () => {
        return await cache.rPop(this.qname)
    }
}

export const OndcTaskQ = new OndcTaskQRedisImpl();
