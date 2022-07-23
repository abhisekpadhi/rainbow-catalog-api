import {cache} from '../common/clients';
import {LOG} from '../common/lib/logger';
import {CONSTANTS} from '../CONSTANTS';
import {searchHandler} from './handlers/search-handlers';
import {selectHandler} from './handlers/select-handler';
import {PROTOCOL_CONTEXT} from './models';

const subscriber = cache.duplicate();

type ITaskPayload = {
    path: string; // ONDC API Path
    body: object;
};

const processTask = async (payload: ITaskPayload) => {
    LOG.info({msg: 'processTask', payload});
    switch (payload.path.slice(1)) {
        case PROTOCOL_CONTEXT.SEARCH:
            await searchHandler(payload.body);
            break;
        case PROTOCOL_CONTEXT.SELECT:
            await selectHandler(payload.body);
            break;
        default:
            break;
    }
}

// subscriber to redis channel, pop's a task item from redis list and processes it
const subscribe = async () => {
    LOG.info('subscription started...')
    await subscriber.subscribe(CONSTANTS.ondcRequestRedisChannel, async (message) => {
        const task = await cache.rPop(CONSTANTS.ondcRequestRedisList)
        if (task !== null && task.length > 0) {
            const taskPayload = JSON.parse(task) as ITaskPayload;
            await processTask(taskPayload);
        }
    });
}

(async () => {
    await subscriber.connect();
    LOG.info('redis subscriber connected')
    await subscribe();
})();


