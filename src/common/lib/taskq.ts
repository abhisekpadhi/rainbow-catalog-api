import {cache} from '../clients';
import {CONSTANTS} from '../../CONSTANTS';

interface ITaskQ {
    enqueue: (payload: string, qname?: string) => void;
    dequeue: (qname?: string) => Promise<string | null>;
}

export class TaskQRedisImpl implements ITaskQ {
    private readonly qname: string;
    private readonly chname: string;
    constructor(
        qname: string = CONSTANTS.ondcRequestRedisList,
        chname: string = CONSTANTS.ondcRequestRedisChannel
    ) {
        this.qname = qname;
        this.chname = chname;
    }

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

export const TaskQ = new TaskQRedisImpl();
