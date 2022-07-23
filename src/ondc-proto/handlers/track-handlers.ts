import {bapCallback} from '../callback';
import {LOG} from '../../common/lib/logger';
import {PROTOCOL_CONTEXT} from '../models';

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
    LOG.info({msg: `confirmType: ${type}`});
    const result = await handleTrack(payload);
    const body = {
        context: payload.context,
        message: result
    };
    LOG.info({msg: 'init handler response', body});
    await bapCallback(PROTOCOL_CONTEXT.ON_INIT, body);
}

const handleTrack = async (request: any) => {
    // todo: implement real-life logic
    return {
        "tracking": {
            "url": "https://track.bpp.com?order_id=0f8c1e68-c041-427d-9ef4-d4d3e5b22ef9",
            "status": "active"
        }
    }

}
