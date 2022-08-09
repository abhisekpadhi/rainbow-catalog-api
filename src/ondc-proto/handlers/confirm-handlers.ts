import {bapCallback} from '../callback';
import {LOG} from '../../common/lib/logger';
import {_paymentResponse, PROTOCOL_CONTEXT} from '../models';
import orderRepo from '../../repository/order-repo';
import {BuyerOrder, OndcContext, OrderStatus, SellerOrder} from '../../models/farmer';
import dayjs from 'dayjs';
import farmInventoryRepo from '../../repository/farm-inventory-repo';
import farmRepo from '../../repository/farm-repo';
import _ from 'lodash';
import {makeEntityId} from '../response-makers';
import sellerOrderRepo from '../../repository/seller-order-repo';
import ondcContextRepo from '../../repository/ondc-context-repo';
import farmerRepo from '../../repository/farmer-repo';
import {sendSms} from '../../common/lib/sms';
import util from 'util';

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

const handleConfirm = async (payload: any) => {
    const ctxTxnId = payload?.context?.transaction_id || '';
    if (ctxTxnId.length === 0) {
        return _makeEmptyResponse();
    }
    const order = await orderRepo.getOrderByCtxTxnId(ctxTxnId);
    LOG.info({order: order?.data});
    if (order === null) {
        return _makeEmptyResponse();
    }
    // update order status in db
    await orderRepo.updateOrder(new BuyerOrder({...order!.data!, orderStatus: OrderStatus.created}).data!);
    // split buyerOrder into multiple sellerOrders
    const itemDetailsList: {
        providerId: string,
        unitPriceInPaise: number,
        id: string,
        quantity: {
            selected: {
                count: number
            }
        },
        price: {
            currency: string,
            value: string,
        },
    }[] = [];
    const ondcItems: {id: string, quantity: {selected: {count: number}}, price: {currency: string, value: string}}[] = JSON.parse(order!.data!.items);
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
    for (const providerId of Object.keys(itemsGroupedByProvider)) {
        const enrichedItems = itemsGroupedByProvider[providerId];
        const subtotal = _.sumBy(enrichedItems, o => o.quantity.selected.count * parseFloat(o.price.value));
        const items = enrichedItems.map(o => _.omit(o, 'providerId', 'priceInPaise'))
        const quote = {
            "price": {
                "currency": "INR",
                "value": subtotal
            },
            "breakup": [
                {
                    "title": "subtotal",
                    "price": {
                        "currency": "INR",
                        "value": subtotal
                    }
                },
            ],
            "ttl": "P4D"
        }
        LOG.info({enrichedItems, subtotal, items, quote});
        const so = new SellerOrder({
            sellerOrderId: makeEntityId('so'),
            sellerProviderId: providerId,
            buyerOrderId: order.data?.orderId || '',
            items: JSON.stringify(items),
            quote: JSON.stringify(quote),
            orderStatus: OrderStatus.created,
        });
        await sellerOrderRepo.insertOrder(so.data!);
    }

    // save context object in db
    if (ctxTxnId.length > 0) {
        await ondcContextRepo.addCtx(new OndcContext({
            ctxTxnId,
            ctx: JSON.stringify(payload?.context || {}),
        }).data!)
    }

    // sms to providers
    const message = 'Received ONDC order from %s (%s), details in DhoomNow app.';
    const providers = Object.keys(itemsGroupedByProvider);
    const farmers = await farmerRepo.getProviderIdPhoneMap(providers);
    if (farmers!== null) {
        for (const f of farmers) {
            const customerName = JSON.parse(order.data!.billing)?.name || '';
            const city = JSON.parse(order.data!.billing)?.address?.city || '';
            await sendSms(util.format(message, customerName, city), f.data!.phone);
        }
    }

    return {
        "order": {
            "id": order!.data!.orderId,
            "state": OrderStatus.created,
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
