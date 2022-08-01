import {bapCallback} from '../callback';
import {LOG} from '../../common/lib/logger';
import {PROTOCOL_CONTEXT} from '../models';
import orderRepo from '../../repository/order-repo';
import {Order, OrderStatus} from '../../models/farmer';
import dayjs from 'dayjs';

const getType = (payload: any) => {
    if (payload?.message?.order_id !== undefined) {
        return 'checkStatusForOrderId';
    }
    return '';
};

export const statusHandler = async (payload: any) => {
    const type = getType(payload);
    if (type.length === 0) {
        return;
    }
    LOG.info({msg: `confirmType: ${type}`});
    const result = await handleCheckStatus(payload);
    const body = {
        context: payload.context,
        message: result
    };
    LOG.info({msg: 'status handler response', body});
    await bapCallback(PROTOCOL_CONTEXT.ON_STATUS, body);
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

const handleCheckStatus = async (payload: any) => {
    const orderId = payload?.message?.order_id || '';
    if (orderId.length === 0) {
        return _makeEmptyResponse();
    }
    const order = await orderRepo.getOrderById(orderId);
    if (order === null) {
        return _makeEmptyResponse();
    }
    // update order status in db
    await orderRepo.updateOrder(new Order({...order!.data!, orderStatus: OrderStatus.active}).data!);
    return {
        "order": {
            "id": order!.data!.orderId,
            "state": order!.data!.orderStatus,
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
