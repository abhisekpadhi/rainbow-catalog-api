import {bapCallback} from '../callback';
import {LOG} from '../../common/lib/logger';
import {PROTOCOL_CONTEXT} from '../models';
import {CONSTANTS} from '../../CONSTANTS';

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
    const result = await handlePhoneNumber(payload);
    const body = {
        context: payload.context,
        message: result
    };
    LOG.info({msg: 'init handler response', body});
    await bapCallback(PROTOCOL_CONTEXT.ON_SUPPORT, body);
}

const handlePhoneNumber = async (request: any) => {
    return {
        "uri": "", // support chat link
        "phone": CONSTANTS.contact,
        "email": CONSTANTS.email
    }
}
