import {bapCallback} from '../callback';
import {LOG} from '../../common/lib/logger';
import {PROTOCOL_CONTEXT} from '../models';
import orderRepo from '../../repository/order-repo';
import {Order} from '../../models/farmer';
import dayjs from 'dayjs';
import {CONSTANTS} from '../../CONSTANTS';

const getType = (payload: any) => {
    if (payload?.message?.order?.billing !== undefined) {
        return 'shareBilling';
    }
    if (payload?.message?.order?.fulfillment !== undefined) {
        return 'shareFFShipping';
    }
    return ''
};

export const initHandler = async (payload: any) => {
    const type = getType(payload);
    if (type.length === 0) {
        return;
    }
    LOG.info({msg: `initType: ${type}`});
    let result = {}
    switch (type) {
        case 'shareBilling':
            result = await handleShareBilling(payload);
            break;
        case 'shareFFShipping':
            result = await handleShareFFShipping(payload);
            break;
        default:
            break;
    }
    const body = {
        context: payload.context,
        message: result
    };
    LOG.info({msg: 'init handler response', body});
    await bapCallback(PROTOCOL_CONTEXT.ON_INIT, body);
}

const _makeEmptyResponse = () => {
    return {
        "order": {
            "items": [],
            "billing": {},
            "fulfillment": {},
            "quote": {},
            "payment": {}
        }
    }
}

const _paymentResponse = {
    "type": "ON-FULFILLMENT",
    "status": "NOT-PAID"
}

// buyer shares billing, seller shares fulfillment policy & payment details
const handleShareBilling = async (payload: any) => {
    const ctxTxnId = payload?.context?.transaction_id || '';
    if (ctxTxnId.length === 0) {
        return _makeEmptyResponse();
    }
    // prepare updated billing
    const billing = payload?.message?.order?.billing
    const order = await orderRepo.getOrderByCtxTxnId(ctxTxnId);
    if (order === null) {
        return _makeEmptyResponse();
    }
    let updated = {...order?.data};
    if (billing !== undefined) {
          updated = {...updated, billing: JSON.stringify(billing)};
    }
    //prepare fulfillment policy response
    const ff = {
        "type": "home-delivery",
        "tracking": false,
        "start": {
            "location": {
                "id": CONSTANTS.name,
                "descriptor": {
                    "name": CONSTANTS.name
                },
                "gps": CONSTANTS.gps
            },
            "time": {
                "range": {
                    "start": `${dayjs().toDate().toISOString()}`,
                    "end": `${dayjs().add(CONSTANTS.deliveryPromiseInDays, 'days').toDate().toISOString()}`,
                }
            },
            "instructions": {
                "name": "pick up instructions",
                "short_desc": "Provide the order id"
            },
            "contact": {
                "phone": CONSTANTS.contact,
                "email": CONSTANTS.email,
            }
        },
        "end": {
            "location": {},
            "time": {
                "range": {
                    "start": `${dayjs().toDate().toISOString()}`,
                    "end": `${dayjs().add(CONSTANTS.deliveryPromiseInDays, 'days').toDate().toISOString()}`,
                }
            },
            "instructions": {},
            "contact": {}
        }
    }
    // prepare payment details
    const payment = _paymentResponse;
    // db call to save billing, ff, payment
    updated = {
        ...updated,
        ff: JSON.stringify(ff),
    }
    const updatedOrder = new Order(updated);
    await orderRepo.updateOrder(updatedOrder.data!);
    // respond
    return  {
        "order": {
            "items": JSON.parse(order!.data!.items),
            "billing": billing,
            "fulfillment": ff,
            "quote": JSON.parse(order!.data!.quote),
            "payment": payment,
        },
    }

};

// buyer shares fulfillment details, seller shares updated quote, with tracking policy
const handleShareFFShipping = async (payload: any) => {
    const ctxTxnId = payload?.context?.transaction_id || '';
    if (ctxTxnId.length === 0) {
        return _makeEmptyResponse();
    }
    // save ff in db, buyer have sent end location
    const ff = payload?.message?.order?.fulfillment;
    if (ff === undefined) {
        return _makeEmptyResponse()
    }
    const order = await orderRepo.getOrderByCtxTxnId(ctxTxnId);
    if (order === null) {
        return _makeEmptyResponse();
    }
    const updatedOrder = new Order({...order!.data, ff: JSON.stringify(ff)});
    await orderRepo.updateOrder(updatedOrder.data!);

    // respond with billing, ff, quote, pricing || quote & pricing does not change
    return  {
        "order": {
            "items": JSON.parse(order!.data!.items),
            "billing": JSON.parse(order!.data!.billing),
            "fulfillment": ff,
            "quote": JSON.parse(order!.data!.quote),
            "payment": _paymentResponse,
        },
    }
}
