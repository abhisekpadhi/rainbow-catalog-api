import {bapCallback} from '../callback';
import {LOG} from '../../common/lib/logger';
import {PROTOCOL_CONTEXT} from '../models';
import orderRepo from '../../repository/order-repo';
import {BuyerOrder, BuyerOrderExtraData, OrderCancelledBy, OrderStatus} from '../../models/farmer';
import dayjs from 'dayjs';
import farmerRepo from '../../repository/farmer-repo';
import {sendSms} from '../../common/lib/sms';
import util from 'util';
import farmInventoryRepo from '../../repository/farm-inventory-repo';
import farmRepo from '../../repository/farm-repo';
import _ from 'lodash';

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

const handleCancelWithNoRefundTerms = async (payload: any, cancelledBy: OrderCancelledBy = 'buyer-app') => {
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
    const prevExtra = order!.data!.extraData.length > 0 ? JSON.parse(order!.data!.extraData) : {};
    await orderRepo.updateOrder(new BuyerOrder({
        ...order!.data,
        orderStatus: OrderStatus.cancelled,
        extraData: JSON.stringify({
            ...prevExtra,
            cancelledBy,
            cancelReason: reason,
        } as BuyerOrderExtraData),
    }).data!);

    // sms to providers
    const message = 'Order cancelled, from %s (%s), details in DhoomNow app.';
    const itemDetailsList: {
        providerId: string,
        unitPriceInPaise: number,
        id: string,
        quantity: {
            count: number
        }}[] = [];
    const ondcItems: {id: string, quantity: {count: number}}[] = JSON.parse(order!.data!.items);
    for (const item of ondcItems) {
        if ('id' in item) {
            const inventory = await farmInventoryRepo.getByMultipleItemIds([item['id']]);
            if (inventory !== null) {
                if (inventory!.length > 0) {
                    const farmId = inventory![0].data?.farmId || 0;
                    if (farmId > 0) {
                        const farm = await farmRepo.getByFarmId(farmId)
                        if (farm !== null) {
                            itemDetailsList.push({
                                ...item,
                                providerId: farm.data?.providerId || '',
                                unitPriceInPaise: inventory![0].data?.priceInPaise || 0,
                            });
                        }
                    }
                }
            }
        }
    }
    const itemsGroupedByProvider = _.groupBy(itemDetailsList, o => o.providerId);
    const providers = Object.keys(itemsGroupedByProvider);
    const farmers = await farmerRepo.getProviderIdPhoneMap(providers);
    if (farmers !== null) {
        for (const f of farmers) {
            const customerName = JSON.parse(order.data!.billing)?.name || '';
            const city = JSON.parse(order.data!.billing)?.address?.city || '';
            await sendSms(util.format(message, customerName, city), f.data!.phone);
        }
    }

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
