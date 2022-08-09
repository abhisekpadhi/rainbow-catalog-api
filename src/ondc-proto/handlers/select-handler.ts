import {LOG} from '../../common/lib/logger';
import {bapCallback} from '../callback';
import {PROTOCOL_CONTEXT} from '../models';
import farmInventoryRepo from '../../repository/farm-inventory-repo';
import _ from 'lodash';
import orderRepo from '../../repository/order-repo';
import {BuyerOrder, OrderStatus} from '../../models/farmer';
import {makeEntityId} from '../response-makers';
import dayjs from 'dayjs';
import {CONSTANTS} from '../../CONSTANTS';

const getSelectType = (payload: any) => {
    if (payload?.message?.order?.items !== undefined) {
        return 'selectItems';
    }
    if (payload?.message?.order?.offers !== undefined) {
        return 'selectOffers';
    }
    if (payload?.message?.order?.add_ons !== undefined) {
        return 'selectAddons';
    }
    return ''
};

export const selectHandler = async (payload: any) => {
    const type = getSelectType(payload);
    if (type.length === 0) {
        return;
    }
    LOG.info({msg: `selectType: ${type}`});
    let result = {}
    switch (type) {
        case 'selectItems':
            result = await handleSelectItems(payload);
            break;
        case 'selectOffers':
            result = await handleSelectOffers(payload);
            break;
        case 'selectAddons':
            result = await handleSelectOffers(payload);
            break;
        default:
            break;
    }
    const body = {
        context: payload.context,
        message: result
    };
    LOG.info({msg: 'select handler response', body});
    await bapCallback(PROTOCOL_CONTEXT.ON_SELECT, body);
}

type ISelectItem = {id: string, quantity: {count: number}};

const _makeEmptyResponse = (quote = {}, items = [], addons = {}, offers = {}) => {
    return {
        "order": {
            "items": items,
            "add-ons": _.isEmpty(addons) ? null : addons,
            "offers": _.isEmpty(offers) ? null : addons,
            "quote": quote
        }
    }
};

const handleSelectItems = async (payload: any) => {
    const ctxTxnId = payload?.context?.transaction_id || '';
    if (ctxTxnId.length === 0) {
        return _makeEmptyResponse();
    }
    const order = await orderRepo.getOrderByCtxTxnId(ctxTxnId);
    LOG.info({ctxTxnId, order});
    const requestedItems: ISelectItem[] = payload?.message?.order?.items || [];
    if (requestedItems.length === 0) {
        // empty out the cart in db
        if (order !== null) {
            if (order.data!.orderStatus === OrderStatus.active) {
                const updatedOrder = new BuyerOrder({...order!.data, items: '', quote: ''});
                await orderRepo.updateOrder(updatedOrder.data!);
                LOG.info({msg: `cart emptied for  txnId ${ctxTxnId}`});
            }
        }
        // respond
        return _makeEmptyResponse();
    }
    // check which item_id exists in our db
    const inventoryItems = await farmInventoryRepo.getByMultipleItemIds(requestedItems.map(o => o.id))

    if (inventoryItems === null) {
        return _makeEmptyResponse();
    }

    // prepare items
    const items = inventoryItems.map(item => {
        const requested = requestedItems.find(o => o.id === item.data!.itemId);
        let count = requested!.quantity.count;
        if (requested!.quantity.count > item.data!.qty) {
            count = item.data!.qty;
        }
        return {
            "id": item.data!.itemId,
            "price" : {
                "currency": "INR",
                "value": ((item.data!.priceInPaise + CONSTANTS.buyerFinderFee * item.data!.priceInPaise)/100).toString(),
            },
            "quantity": {
                "selected": {
                    "count": count
                }
            }
        }
    });

    // prepare quote
    const subtotal = _.sumBy(items, o => parseFloat(o.price.value) * o.quantity.selected.count);
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
    // save updated cart in db, order created first time here
    const updatedOrder = new BuyerOrder({
        ...order?.data,
        orderId: order !== null ? order.data!.orderId : makeEntityId('order'),
        ctxTxnId,
        createdAt: order !== null ? order.data!.createdAt : dayjs().valueOf(),
        items: JSON.stringify(items),
        quote: JSON.stringify(quote),
    });
    let updateDb = false;
    if (order !== null) {
        if (order.data!.orderStatus === OrderStatus.active) {
            LOG.info({msg: `order with ctxTxnId ${ctxTxnId} exists in Active state, will update`})
            updateDb = true;
        } else {
            LOG.info({msg: `order for txnId ${ctxTxnId} already in Created state, will not update`});
        }
    } else {
        LOG.info({msg: `new order with ctxTxnId ${ctxTxnId} will update`})
        updateDb = true;
    }
    if (updateDb) {
        await (order === null ? orderRepo.insertOrder : orderRepo.updateOrder)(updatedOrder.data!)
        LOG.info({msg: 'order updated'});
    }
    const emptyResponse = _makeEmptyResponse()
    return {
        ...emptyResponse,
        "order": {
            ...emptyResponse.order,
            "items": items,
            "quote": quote
        }
    }
};

const handleSelectOffers = async (payload: any) => {
    const ctxTxnId = payload?.context?.transaction_id || '';
    if (ctxTxnId.length === 0) {
        return _makeEmptyResponse();
    }
    // we don't have offers and addons yet, just return the cart
    const order = await orderRepo.getOrderByCtxTxnId(ctxTxnId);
    if (order === null) {
        return _makeEmptyResponse();
    }
    const emptyResponse = _makeEmptyResponse();
    return {
        ...emptyResponse,
        "order": {
            ...emptyResponse.order,
            "items": JSON.parse(order!.data!.items),
            "quote": JSON.parse(order!.data!.quote),
        }
    }
};
