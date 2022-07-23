import {LOG} from '../../common/lib/logger';
import {bapCallback} from '../callback';
import {PROTOCOL_CONTEXT} from '../models';

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
            result = await handleSelectAddOns(payload);
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

const handleSelectItems = async (request: any) => {
    // todo: implement real-life searching logic
    return {
        "order": {
            "items": [
                {
                    "id": "item_1",
                    "price" : {
                        "currency": "INR",
                        "value": "40"
                    },
                    "quantity": {
                        "selected": {
                            "count": 1
                        }
                    }
                },
                {
                    "id": "item_4",
                    "price" : {
                        "currency": "INR",
                        "value": "60"
                    },
                    "quantity": {
                        "selected": {
                            "count": 2
                        }
                    }
                }
            ],
            "quote": {
                "price": {
                    "currency": "INR",
                    "value": "180"
                },
                "breakup": [
                    {
                        "title": "Brown Bread 400 gm",
                        "price": {
                            "currency": "INR",
                            "value": "40"
                        }
                    },
                    {
                        "title": "Good Life Toned Milk 1L",
                        "price": {
                            "currency": "INR",
                            "value": "120"
                        }
                    }
                ],
                "ttl": "P4D"
            }
        }
    }
};

const handleSelectOffers = async (request: any) => {
    // todo: implement real-life searching logic
    return {
        "order": {
            "items": [
                {
                    "id": "item_1",
                    "price" : {
                        "currency": "INR",
                        "value": "40"
                    },
                    "quantity": {
                        "selected": {
                            "count": 1
                        }
                    }
                },
                {
                    "id": "item_4",
                    "price" : {
                        "currency": "INR",
                        "value": "60"
                    },
                    "quantity": {
                        "selected": {
                            "count": 2
                        }
                    }
                }
            ],
            "offers": {
                "id": "offer_1",
                "descriptor": {
                    "name" : "10% off"
                }
            },
            "quote": {
                "price": {
                    "currency": "INR",
                    "value": "162"
                },
                "breakup": [
                    {
                        "title": "Brown Bread 400 gm",
                        "price": {
                            "currency": "INR",
                            "value": "40"
                        }
                    },
                    {
                        "title": "Good Life Toned Milk 1L",
                        "price": {
                            "currency": "INR",
                            "value": "120"
                        }
                    },
                    {
                        "title": "10% off",
                        "price": {
                            "currency": "INR",
                            "value": "-18"
                        }
                    }
                ],
                "ttl": "P4D"
            }
        }
    }
};

const handleSelectAddOns = async (request: any) => {
    // todo: implement real-life searching logic
    return {
        "order": {
            "items": [
                {
                    "id": "item_1",
                    "price" : {
                        "currency": "INR",
                        "value": "40"
                    },
                    "quantity": {
                        "selected": {
                            "count": 1
                        }
                    }
                },
                {
                    "id": "item_4",
                    "price" : {
                        "currency": "INR",
                        "value": "60"
                    },
                    "quantity": {
                        "selected": {
                            "count": 2
                        }
                    }
                }
            ],
            "add-ons": {
                "id": "add_on_1",
                "price" : {
                    "currency": "INR",
                    "value": "20"
                }
            },
            "quote": {
                "price": {
                    "currency": "INR",
                    "value": "200"
                },
                "breakup": [
                    {
                        "title": "Brown Bread 400 gm",
                        "price": {
                            "currency": "INR",
                            "value": "40"
                        }
                    },
                    {
                        "title": "Strawberry Jam",
                        "price": {
                            "currency": "INR",
                            "value": "20"
                        }
                    },
                    {
                        "title": "Good Life Toned Milk 1L",
                        "price": {
                            "currency": "INR",
                            "value": "120"
                        }
                    }
                ],
                "ttl": "P4D"
            }
        }
    }
};
