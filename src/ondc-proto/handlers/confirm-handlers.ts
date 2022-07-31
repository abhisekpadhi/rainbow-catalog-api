import {bapCallback} from '../callback';
import {LOG} from '../../common/lib/logger';
import {PROTOCOL_CONTEXT} from '../models';
import orderRepo from '../../repository/order-repo';
import {Order, OrderStatus} from '../../models/farmer';
import dayjs from 'dayjs';

const getType = (payload: any) => {
    if (payload?.message?.order?.payment?.type !== undefined) {
        switch (payload.message.order.payment.type) {
            case 'ON-ORDER':
                return 'payAndConfirm';
            case 'ON-FULFILLMENT':
                return 'promiseToPayOnFFConfirm';
            default:
                return ''
        }
    }
    return '';
};

export const confirmHandler = async (payload: any) => {
    const type = getType(payload);
    if (type.length === 0) {
        return;
    }
    LOG.info({msg: `confirmType: ${type}`});
    const result = await handleConfirm(payload);
    const body = {
        context: payload.context,
        message: result
    };
    LOG.info({msg: 'confirm handler response', body});
    await bapCallback(PROTOCOL_CONTEXT.ON_CONFIRM, body);
}

const _makeEmptyResponse = () => {
    return {
        "order": {
            "id": "",
            "state": "",
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

const handleConfirm = async (payload: any) => {
    const ctxTxnId = payload?.context?.transaction_id || '';
    if (ctxTxnId.length === 0) {
        return _makeEmptyResponse();
    }
    const order = await orderRepo.getOrderByCtxTxnId(ctxTxnId);
    if (order === null) {
        return _makeEmptyResponse();
    }
    // update order status in db
    await orderRepo.updateOrder(new Order({...order!.data!, orderStatus: OrderStatus.active}).data!);
    return {
        "order": {
            "id": order!.data!.orderId,
            "state": OrderStatus.active,
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
