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
    await bapCallback(PROTOCOL_CONTEXT.ON_INIT, body);
}

const handleAckRating = async (request: any) => {
    // todo: implement real-life logic
    return {
        "feedback_ack": true,
        "rating_ack": true
    }
}

const handleSendFeedbackForm = async (request: any) => {
    // todo: implement real-life logic
    return {
        "feedback_form" : [
            {
                "id": "1",
                "parent_id": null,
                "answer": null,
                "answer_type": null,
                "question": "Did you like the service?"
            },
            {
                "id": "2",
                "parent_id": "1",
                "answer_type": "radio-button",
                "answer": "Yes"
            },
            {
                "id": "3",
                "parent_id": "1",
                "answer_type": "radio-button",
                "answer": "No"
            },
            {
                "id": "4",
                "parent_id": null,
                "answer_type": null,
                "answer": null,
                "question": "What did you like?"
            },
            {
                "id": "5",
                "parent_id": "4",
                "answer_type": "check-box",
                "answer": "Packaging"
            },
            {
                "id": "6",
                "parent_id": "4",
                "answer_type": "check-box",
                "answer": "Food"
            },
            {
                "id": "7",
                "parent_id": null,
                "answer_type": "free-text",
                "question": "What can we improve on?"
            }
        ]
    }
}
