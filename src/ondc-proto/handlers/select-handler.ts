import {LOG} from '../../common/lib/logger';
import {bapCallback} from '../callback';
import {PROTOCOL_CONTEXT} from '../models';
import farmInventoryRepo from '../../repository/farm-inventory-repo';
import _ from 'lodash';
import orderRepo from '../../repository/order-repo';
import {Order} from '../../models/farmer';

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
            "add-ons": addons,
            "offers": offers,
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
    const requestedItems: ISelectItem[] = payload?.message?.order?.items || [];
    if (requestedItems.length === 0) {
        // empty out the cart in db
        if (order !== null) {
            const updatedOrder = new Order({...order!.data, items: '', quote: ''});
            await orderRepo.updateOrder(updatedOrder.data!);
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
            count = 0
        }
        return {
            "id": item.data!.itemId,
            "price" : {
                "currency": "INR",
                "value": (item.data!.priceInPaise/100).toString(),
            },
            "quantity": {
                "selected": {
                    "count": count
                }
            }
        }
    });

    // prepare quote
    const subtotal = _.sumBy(items, o => parseFloat(o.price.value));
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
    // save updated cart in db
    const updatedOrder = new Order({
        ...order!.data,
        items: JSON.stringify(items),
        quote: JSON.stringify(quote),
    });
    await orderRepo.updateOrder(updatedOrder.data!)
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
    const order = await orderRepo.getOrderByCtxTxnId(payload);
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
