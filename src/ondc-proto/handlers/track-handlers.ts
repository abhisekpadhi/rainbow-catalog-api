import {bapCallback} from '../callback';
import {LOG} from '../../common/lib/logger';
import {PROTOCOL_CONTEXT} from '../models';
import util from 'util';
import {CONSTANTS} from '../../CONSTANTS';
import orderRepo from '../../repository/order-repo';

const getType = (payload: any) => {
    if (payload?.message?.callback_url !== undefined) {
        return 'trackWebsocket';
    }
    if (payload?.message?.order_id !== undefined) {
        return 'trackOrderId';
    }
    return '';
};

export const trackHandler = async (payload: any) => {
    const type = getType(payload);
    if (type.length === 0) {
        return;
    }
    LOG.info({msg: `trackType: ${type}`});
    const result = await handleTrack(payload);
    const body = {
        context: payload.context,
        message: result
    };
    LOG.info({msg: 'init handler response', body});
    await bapCallback(PROTOCOL_CONTEXT.ON_TRACK, body);
}

const handleTrack = async (payload: any) => {
    const orderId = payload?.message?.order_id;
    const order = await orderRepo.getOrderById(orderId);
    return {
        "tracking": {
            "url": order !== null ? util.format(CONSTANTS.trackingUrl, orderId) : '',
            "status": order?.data?.orderStatus || '',
        }
    }
};
