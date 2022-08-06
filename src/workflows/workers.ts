import {cache} from '../common/clients';
import {LOG} from '../common/lib/logger';
import {__DEV__, CONSTANTS} from '../CONSTANTS';
import {sendSms} from '../common/lib/sms';

const subscriber = cache.duplicate();

type ITaskPayloadType = 'otp';
type ITaskPayload = {
    type: ITaskPayloadType;
    body: object;
};

// routes task to appropriate handlers
const processTask = async (payload: ITaskPayload) => {
    LOG.info({msg: 'processTask', payload});
    switch (payload.type) {
        case 'otp':
            await otpHandler(payload.body);
            break;
        default:
            break;
    }
}

// subscriber to redis channel, pop's a task item from redis list and processes it
const subscribe = async () => {
    LOG.info('bg task channel subscription started...')
    await subscriber.subscribe(CONSTANTS.bgTaskRedisChannel, async (message) => {
        const task = await cache.rPop(CONSTANTS.bgTaskRedisList)
        if (task !== null && task.length > 0) {
            const taskPayload = JSON.parse(task) as ITaskPayload;
            await processTask(taskPayload);
        }
    });
}

const otpHandler = async (payload: any) => {
    if ('to' in payload && 'message' in payload) {
        if (payload.to.length >= 10 && payload.message.length > 0) {
            !__DEV__ && await sendSms(payload.message, payload.to);
        }
    }
}

(async () => {
    await subscriber.connect();
    LOG.info('bg task redis subscriber connected')
    await subscribe();
})();


