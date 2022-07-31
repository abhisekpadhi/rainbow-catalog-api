import {bapCallback} from '../callback';
import {LOG} from '../../common/lib/logger';
import {PROTOCOL_CONTEXT} from '../models';
import orderRepo from '../../repository/order-repo';
import {Order, OrderExtraData, OrderStatus} from '../../models/farmer';
import dayjs from 'dayjs';

const getType = (payload: any) => {
    if (payload?.message?.cancellation_reason_id !== undefined) {
        return 'cancelWithReason'
    }
    if (payload?.message?.order_id !== undefined) {
        return 'cancelOrderId'
    }
    return '';
};

export const cancelHandler = async (payload: any) => {
    const type = getType(payload);
    if (type.length === 0) {
        return;
    }
    LOG.info({msg: `confirmType: ${type}`});
    // todo: figure out if the cancellation requires refund terms or not
    // const refundTermsRequired = false; // todo: compute this
    let result = {}
    result = await handleCancelWithNoRefundTerms(payload);
    // if(refundTermsRequired){
    //     result = await handleCancelWithRefundTerms(payload);
    // } else {
    //     result = await handleCancelWithNoRefundTerms(payload);
    // }
    const body = {
        context: payload.context,
        message: result
    };
    LOG.info({msg: 'cancel handler response', body});
    await bapCallback(PROTOCOL_CONTEXT.ON_CANCEL, body);
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

const handleCancelWithNoRefundTerms = async (payload: any) => {
    const reason = payload?.message?.cancellation_reason_id || '';
    const orderId = payload?.message?.order_id || '';
    if (orderId.length === 0) {
        return _makeEmptyResponse()
    }
    const order = await orderRepo.getOrderById(orderId);
    if (order === null) {
        return _makeEmptyResponse();
    }
    // update db
    await orderRepo.updateOrder(new Order({...order!.data, orderStatus: OrderStatus.cancelled, extraData: JSON.stringify({cancelReason: reason} as OrderExtraData)}).data!);

    return {
        "order": {
            "id": order!.data!.orderId,
            "state": OrderStatus.cancelled,
            "items": JSON.parse(order!.data!.items),
            "billing": JSON.parse(order!.data!.billing),
            "fulfillment": JSON.parse(order!.data!.ff),
            "quote": JSON.parse(order!.data!.quote),
            "payment": _paymentResponse,
            "created_at": dayjs(order!.data!.createdAt).toDate().toISOString(),
            "updated_at": dayjs().toDate().toISOString(),

        }
    }

}
