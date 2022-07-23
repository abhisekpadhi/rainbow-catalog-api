import {bapCallback} from '../callback';
import {LOG} from '../../common/lib/logger';
import {PROTOCOL_CONTEXT} from '../models';

const getType = (payload: any) => {
    if (payload?.message?.ref_id !== undefined) {
        return 'support' // ref_id must have prefix (ex: item_) to identify entity like - item_123, order_123, etc
    }
    return '';
};

export const supportHandler = async (payload: any) => {
    const type = getType(payload);
    if (type.length === 0) {
        return;
    }
    LOG.info({msg: `confirmType: ${type}`});
    // todo: figure out what support handler to trigger b/w chat-link, phone, email
    const result = await handleChatLink(payload);
    const body = {
        context: payload.context,
        message: result
    };
    LOG.info({msg: 'init handler response', body});
    await bapCallback(PROTOCOL_CONTEXT.ON_INIT, body);
}

const handleChatLink = async (request: any) => {
    // todo: implement real-life logic
    return {
        "uri": "http://support.bpp.com?order_id=0f8c1e68-c041-427d-9ef4-d4d3e5b22ef9"
    }
}

const handlePhoneNumber = async (request: any) => {
    // todo: implement real-life logic
    return {
        "phone": "+919898989898"
    }

}

const handleEmail = async (request: any) => {
    // todo: implement real-life logic
    return {
        "email": "support@example.com"
    }

}
