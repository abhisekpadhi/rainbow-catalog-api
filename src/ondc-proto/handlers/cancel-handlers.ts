import {bapCallback} from '../callback';
import {LOG} from '../../common/lib/logger';
import {PROTOCOL_CONTEXT} from '../models';

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
    const refundTermsRequired = false; // todo: compute this
    let result = {}
    if(refundTermsRequired){
        result = await handleCancelWithRefundTerms(payload);
    } else {
        result = await handleCancelWithNoRefundTerms(payload);
    }
    const body = {
        context: payload.context,
        message: result
    };
    LOG.info({msg: 'cancel handler response', body});
    await bapCallback(PROTOCOL_CONTEXT.ON_CANCEL, body);
}

const handleCancelWithRefundTerms = async (request: any) => {
    // todo: implement real-life logic
    return {
        "order": {
            "id":"order_1",
            "state":"Cancelled",
            "items":[
                {
                    "id": "item_1",
                    "quantity": {
                        "count": 2
                    }
                },
                {
                    "id": "item_2",
                    "quantity": {
                        "count": 1
                    }
                }
            ],
            "billing": {
                "name": "John Doe",
                "address": {
                    "door": "21A",
                    "name": "ABC Apartments",
                    "locality": "HSR Layout",
                    "city": "Bengaluru",
                    "state": "Karnataka",
                    "country": "India",
                    "area_code": "560102"
                },
                "email": "user@example.com",
                "phone": "+919876543210"
            },
            "fulfillment": {
                "type": "home-delivery",
                "tracking": false,
                "start": {
                    "location": {
                        "id": "koramangala-4th-block-location",
                        "descriptor": {
                            "name": "Pooja Stores"
                        },
                        "gps": "12.9349377,77.6055586"
                    },
                    "time": {
                        "range": {
                            "start": "2021-06-15T07:09:30.000Z",
                            "end": "2021-06-15T07:10:30.000Z"
                        }
                    },
                    "instructions": {
                        "name": "pick up instructions",
                        "short_desc": "Provide the order id"
                    },
                    "contact": {
                        "phone": "+919999999999",
                        "email": "info@poojastores.com"
                    }
                },
                "end": {
                    "location": {
                        "gps": "12.914028, 77.638698",
                        "address": {
                            "door": "21A",
                            "name": "ABC Apartments",
                            "locality": "HSR Layout",
                            "city": "Bengaluru",
                            "state": "Karnataka",
                            "country": "India",
                            "area_code": "560102"
                        }
                    },
                    "time": {
                        "range": {
                            "start": "2021-06-15T07:11:36.212Z",
                            "end": "2021-06-15T07:12:36.212Z"
                        }
                    },
                    "instructions": {
                        "name": "drop off instructions",
                        "short_desc": "Leave at door step"
                    },
                    "contact": {
                        "phone": "+919876543210",
                        "email": "user@example.com"
                    }
                }
            },
            "quote": {
                "price": {
                    "currency": "INR",
                    "value": "370"
                },
                "breakup": [
                    {
                        "title": "Red Apples",
                        "price": {
                            "currency": "INR",
                            "value": "180"
                        }
                    },
                    {
                        "title": "Green Apples Organic",
                        "price": {
                            "currency": "INR",
                            "value": "170"
                        }
                    },
                    {
                        "title": "Delivery Charges",
                        "price": {
                            "currency": "INR",
                            "value": "20"
                        }
                    }
                ]
            },
            "payment": {
                "uri": "https://api.bpp.com/pay?amt=$640&mode=upi&vpa=bpp@upi",
                "tl_method": "http/get",
                "params": {
                    "amount": "640",
                    "mode": "upi",
                    "vpa": "bpp@upi",
                    "transaction_status": "refund initiated"
                },
                "type": "ON-ORDER",
                "status": "PAID"
            }
        }
    }

}

const handleCancelWithNoRefundTerms = async (request: any) => {
    // todo: implement real-life logic
    return {
        "order": {
            "id":"order_1",
            "state":"Cancelled",
            "items":[
                {
                    "id": "item_1",
                    "quantity": {
                        "count": 2
                    }
                },
                {
                    "id": "item_2",
                    "quantity": {
                        "count": 1
                    }
                }
            ],
            "billing": {
                "name": "John Doe",
                "address": {
                    "door": "21A",
                    "name": "ABC Apartments",
                    "locality": "HSR Layout",
                    "city": "Bengaluru",
                    "state": "Karnataka",
                    "country": "India",
                    "area_code": "560102"
                },
                "email": "user@example.com",
                "phone": "+919876543210"
            },
            "fulfillment": {
                "type": "home-delivery",
                "tracking": false,
                "start": {
                    "location": {
                        "id": "koramangala-4th-block-location",
                        "descriptor": {
                            "name": "Pooja Stores"
                        },
                        "gps": "12.9349377,77.6055586"
                    },
                    "time": {
                        "range": {
                            "start": "2021-06-15T07:09:30.000Z",
                            "end": "2021-06-15T07:10:30.000Z"
                        }
                    },
                    "instructions": {
                        "name": "pick up instructions",
                        "short_desc": "Provide the order id"
                    },
                    "contact": {
                        "phone": "+919999999999",
                        "email": "info@poojastores.com"
                    }
                },
                "end": {
                    "location": {
                        "gps": "12.914028, 77.638698",
                        "address": {
                            "door": "21A",
                            "name": "ABC Apartments",
                            "locality": "HSR Layout",
                            "city": "Bengaluru",
                            "state": "Karnataka",
                            "country": "India",
                            "area_code": "560102"
                        }
                    },
                    "time": {
                        "range": {
                            "start": "2021-06-15T07:11:36.212Z",
                            "end": "2021-06-15T07:12:36.212Z"
                        }
                    },
                    "instructions": {
                        "name": "drop off instructions",
                        "short_desc": "Leave at door step"
                    },
                    "contact": {
                        "phone": "+919876543210",
                        "email": "user@example.com"
                    }
                }
            },
            "quote": {
                "price": {
                    "currency": "INR",
                    "value": "370"
                },
                "breakup": [
                    {
                        "title": "Red Apples",
                        "price": {
                            "currency": "INR",
                            "value": "180"
                        }
                    },
                    {
                        "title": "Green Apples Organic",
                        "price": {
                            "currency": "INR",
                            "value": "170"
                        }
                    },
                    {
                        "title": "Delivery Charges",
                        "price": {
                            "currency": "INR",
                            "value": "20"
                        }
                    }
                ]
            },
            "payment": {
                "uri": "https://api.bpp.com/pay?amt=$640&mode=upi&vpa=bpp@upi",
                "tl_method": "http/get",
                "params": {
                    "amount": "640",
                    "mode": "upi",
                    "vpa": "bpp@upi"
                },
                "type": "ON-FULFILLMENT",
                "status": "NOT-PAID"
            }
        }
    }

}
