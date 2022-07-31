import {bapCallback} from '../callback';
import {LOG} from '../../common/lib/logger';
import {PROTOCOL_CONTEXT} from '../models';

const getType = (payload: any) => {
    if (payload?.message?.rating_category !== undefined) {
        return payload.message.rating_category // can be comma separated values: add-ons, payment, billing, fulfillment, items
    }
    return '';
};

export const ratingHandler = async (payload: any) => {
    const type = getType(payload);
    if (type.length === 0) {
        return;
    }
    LOG.info({msg: `confirmType: ${type}`});
    // todo: figure out when handleSendFeedbackForm is required
    const result = await handleAckRating(payload);
    const body = {
        context: payload.context,
        message: result
    };
    LOG.info({msg: 'init handler response', body});
    await bapCallback(PROTOCOL_CONTEXT.ON_RATING, body);
}

// for hackathon we are ignoring all ratings
const handleAckRating = async (request: any) => {
    // todo: implement real-life logic
    return {
        "feedback_ack": true,
        "rating_ack": true
    }
}
