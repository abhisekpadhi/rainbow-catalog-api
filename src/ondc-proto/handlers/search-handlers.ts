import {bapCallback} from '../callback';
import {PROTOCOL_CONTEXT} from '../models';
import {LOG} from '../../common/lib/logger';

const getSearchType = (payload: any) => {
    if (payload?.message?.intent?.item?.descriptor?.name !== undefined) {
        return 'searchByItemName';
    }
    if (payload?.message?.intent?.provider !== undefined) {
        return 'searchByStoreName';
    }
    if (payload?.message?.intent?.fulfillment?.start !== undefined) {
        return 'searchByPickupLocation';
    }
    if (payload?.message?.intent?.fulfillment?.end !== undefined) {
        return 'searchByDeliveryLocation';
    }
    if (payload?.message?.intent?.fulfillment?.type !== undefined) {
        return 'searchByFulfillmentMethod';
    }
    if (payload?.message?.intent?.item?.id !== undefined) {
        return 'searchByItemId';
    }
    if (payload?.message?.intent?.provider?.id !== undefined) {
        return 'searchByStoreId';
    }
    if (payload?.message?.intent?.item?.price !== undefined) {
        return 'searchByPriceRange';
    }
    if (payload?.message?.intent?.provider?.rating !== undefined) {
        return 'searchByStoreRating';
    }
    if (payload?.message?.intent?.category?.descriptor !== undefined) {
        return 'searchByCategoryName';
    }
    if (payload?.message?.intent?.category?.id !== undefined) {
        return 'searchByCategoryId';
    }
    return '';
}

export const searchHandler = async (payload: any) => {
    const searchType = getSearchType(payload);
    LOG.info({msg: `searchTyp: ${searchType}`});
    if (searchType.length === 0) {
        return;
    }
    const listOfStoresSet = new Set([
        'searchByStoreName',
        'searchByPickupLocation',
        'searchByDeliveryLocation',
        'searchByFulfillmentMethod',
        'searchByStoreId',
        'searchByStoreRating',
    ]);

    const listOfCategorySet = new Set([
        'searchByCategoryName',
        'searchByCategoryId'
    ]);

    let result = {}

    if (!(new Set([...listOfCategorySet, ...listOfStoresSet]).has(searchType))) {
        result = await searchForListOfItems(payload)
    }

    if (listOfStoresSet.has(searchType)) {
        result = await searchForListOfStores(payload);
    }

    if (listOfCategorySet.has(searchType)) {
        result = await searchForListOfCategory(payload);
    }

    const body = {
        context: payload.context,
        message: result
    };

    LOG.info({msg: 'search handler response', body});

    await bapCallback(PROTOCOL_CONTEXT.ON_SEARCH, body);
}

const searchForListOfItems = async (request: any) => {
    // todo: implement real-life searching logic
    return {
        "catalog": {
            "bpp/descriptor": {
                "name": "Shop EZ"
            },
            "bpp/providers": [
                {
                    "id": "pooja_stores",
                    "descriptor": {
                        "name": "Pooja Stores"
                    },
                    "locations": [
                        {
                            "id": "pooja_stores_location",
                            "gps": "12.9349377,77.6055586"
                        }
                    ],
                    "items": [
                        {
                            "id": "item_1",
                            "descriptor": {
                                "name": "Brown Bread 400 gm"
                            },
                            "location_id": "pooja_stores_location",
                            "price": {
                                "currency": "INR",
                                "value": "40"
                            },
                            "matched": true
                        },
                        {
                            "id": "item_2",
                            "descriptor": {
                                "name": "Good Life Toned Milk 1L"
                            },
                            "location_id": "pooja_stores_location",
                            "price": {
                                "currency": "INR",
                                "value": "60"
                            },
                            "matched": true
                        }
                    ],
                    "exp": "2021-06-23T09:53:38.873Z"
                },
                {
                    "id": "food_mall",
                    "descriptor": {
                        "name": "Food Mall"
                    },
                    "locations": [
                        {
                            "id": "food_mall_location",
                            "gps": "12.9349377,77.6055586"
                        }
                    ],
                    "items": [
                        {
                            "id": "bread_400g",
                            "descriptor": {
                                "name": "Brown Bread 400 gm"
                            },
                            "location_id": "food_mall_location",
                            "price": {
                                "currency": "INR",
                                "value": "40"
                            },
                            "matched": true
                        },
                        {
                            "id": "gl_milk",
                            "descriptor": {
                                "name": "Good Life Toned Milk 1L"
                            },
                            "location_id": "food_mall_location",
                            "price": {
                                "currency": "INR",
                                "value": "60"
                            },
                            "matched": true
                        }
                    ],
                    "exp": "2021-06-23T09:53:38.873Z"
                }
            ]
        }
    };
};

const searchForListOfStores = async (payload: any) => {
    // todo: implement real-life searching logic
    return {
        "catalog": {
            "bpp/descriptor": {
                "name": "BPP"
            },
            "bpp/providers": [
                {
                    "id": "pooja_stores",
                    "descriptor": {
                        "name": "Pooja Stores"
                    },
                    "locations": [
                        {
                            "id": "pooja_stores_location",
                            "gps": "12.9349377,77.6055586"
                        }
                    ]
                },
                {
                    "id": "good_stores",
                    "descriptor": {
                        "name": "Good Stores"
                    },
                    "locations": [
                        {
                            "id": "good_stores_location",
                            "gps": "12.9349406,77.6208795"
                        }
                    ]
                },
                {
                    "id": "food_mall",
                    "descriptor": {
                        "name": "Food Mall"
                    },
                    "locations": [
                        {
                            "id": "food_mall_location",
                            "gps": "12.9349377,77.6055586"
                        }
                    ]
                }
            ]
        }
    }
}

const searchForListOfCategory = async (payload: any) => {
    // todo: implement real-life searching logic
    return {
        "catalog": {
            "bpp/descriptor": {
                "name": "BPP"
            },
            "bpp/providers": [
                {
                    "id": "pooja_stores",
                    "descriptor": {
                        "name": "Pooja Stores"
                    },
                    "categories": [
                        {
                            "id": "pooja_bread",
                            "descriptor": {
                                "name": "Breads"
                            }
                        },
                        {
                            "id": "pooja_diary",
                            "descriptor": {
                                "name": "Dairy"
                            }
                        }
                    ],
                    "matched": true
                },
                {
                    "id": "good_stores",
                    "descriptor": {
                        "name": "Good Stores"
                    },
                    "categories": [
                        {
                            "id": "bread_and_diary",
                            "descriptor": {
                                "name": "Bread and Dairy"
                            }
                        }
                    ],
                    "matched": true
                },
                {
                    "id": "natures_basket",
                    "descriptor": {
                        "name": "Nature's basket"
                    },
                    "categories": [
                        {
                            "id": "natural_bread_and_diary",
                            "descriptor": {
                                "name": "Bread and Dairy"
                            }
                        }
                    ],
                    "matched": true
                }
            ]
        }
    }
}
