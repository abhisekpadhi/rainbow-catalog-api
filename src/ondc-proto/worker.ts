import {cache} from '../common/clients';
import {LOG} from '../common/lib/logger';
import {CONSTANTS} from '../CONSTANTS';
import {PROTOCOL_CONTEXT} from './models';
import {searchHandler} from './handlers/search-handlers';
import {selectHandler} from './handlers/select-handler';
import {initHandler} from './handlers/init-handler';
import {confirmHandler} from './handlers/confirm-handlers';
import {statusHandler} from './handlers/status-handlers';
import {updateHandler} from './handlers/update-handler';
import {cancelHandler} from './handlers/cancel-handlers';
import {trackHandler} from './handlers/track-handlers';
import {ratingHandler} from './handlers/rating-handlers';
import {supportHandler} from './handlers/support-handlers';

const subscriber = cache.duplicate();

type ITaskPayload = {
    path: string; // ONDC API Path
    body: object;
};

// routes task to appropriate handlers
const processTask = async (payload: ITaskPayload) => {
    LOG.info({msg: 'processTask', payload});
    switch (payload.path.slice(1)) {
        case PROTOCOL_CONTEXT.SEARCH:
            await searchHandler(payload.body);
            break;
        case PROTOCOL_CONTEXT.SELECT:
            await selectHandler(payload.body);
            break;
        case PROTOCOL_CONTEXT.INIT:
            await initHandler(payload.body);
            break;
        case PROTOCOL_CONTEXT.CONFIRM:
            await confirmHandler(payload.body);
            break;
        case PROTOCOL_CONTEXT.STATUS:
            await statusHandler(payload.body);
            break;
        case PROTOCOL_CONTEXT.TRACK:
            await trackHandler(payload.body);
            break;
        case PROTOCOL_CONTEXT.UPDATE:
            await updateHandler(payload.body);
            break;
        case PROTOCOL_CONTEXT.CANCEL:
            await cancelHandler(payload.body);
            break;
        case PROTOCOL_CONTEXT.RATING:
            await ratingHandler(payload.body);
            break;
        case PROTOCOL_CONTEXT.SUPPORT:
            await supportHandler(payload.body);
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


