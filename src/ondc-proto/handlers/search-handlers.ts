import {bapCallback} from '../callback';
import {PROTOCOL_CONTEXT} from '../models';
import {LOG} from '../../common/lib/logger';
import farmInventoryRepo from '../../repository/farm-inventory-repo';
import farmRepo from '../../repository/farm-repo';
import _ from 'lodash';
import productCatalogRepo from '../../repository/product-catalog-repo';
import {Farm, FarmInventory} from '../../models/farmer';
import {makeEntityId} from '../response-makers';
import {CONSTANTS} from '../../CONSTANTS';

const categoryId = 'Fruits and Vegetables';

const getSearchType = (payload: any) => {
    if (payload?.message?.intent?.item?.price !== undefined) {
        return 'searchByPriceRange';
    }
    if (payload?.message?.intent?.item?.id !== undefined) {
        return 'searchByItemId';
    }
    if (payload?.message?.intent?.provider?.id !== undefined) {
        return 'searchByStoreId';
    }
    if (payload?.message?.intent?.item?.descriptor?.name !== undefined) {
        return 'searchByItemName';
    }
    if (payload?.message?.intent?.provider?.descriptor?.name !== undefined) {
        return 'searchByStoreName';
    }
    if (payload?.message?.intent?.provider?.rating !== undefined) {
        return 'searchByStoreRating';
    }
    if (payload?.message?.intent?.category?.descriptor?.name !== undefined) {
        return 'searchByCategoryName';
    }
    if (payload?.message?.intent?.category?.id !== undefined) {
        return 'searchByCategoryId';
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

    const listOfItemsSet = new Set([
        'searchByItemName',
        'searchByPriceRange',
        'searchByItemId'
    ]);

    let result: object | null = {};

    if (listOfItemsSet.has(searchType)) {
        result = await searchForListOfItems(payload, searchType);
    }

    if (listOfStoresSet.has(searchType)) {
        result = await searchForListOfStores(payload, searchType);
    }
    if (listOfCategorySet.has(searchType)) {
        result = await searchForListOfCategory(payload, searchType);
    }
    if (result === null) {
        result = {
            "catalog": {
                "bpp/descriptor": {
                    "name": "dhoomnow.com",
                    "short_desc": "",
                    "long_desc": "",
                    "symbol": "",
                },
                "bpp/providers": [],
            }
        }
    }
    const body = {
        context: payload.context,
        message: result
    };
    LOG.info({msg: 'search handler response', body});
    await bapCallback(PROTOCOL_CONTEXT.ON_SEARCH, body);
}

// todo: hit cache first then db
const _getFarmById = async (farmId: string) => {
    return await farmRepo.getByFarmId(parseInt(farmId, 10))
}

// todo: hit cache first then db
const _getProduct = async (productId: string) => {
    LOG.info({msg: '_getProductId', productId});
    return await productCatalogRepo.getByProductId(productId);
}

const _makeCatalogResponseFromFarmInventoryList = async (queryResult: FarmInventory[]) => {
    const queryResultByFarm = _.groupBy(queryResult, o => o.data!.farmId);
    LOG.info({msg: 'queryResultByFarm', queryResultByFarm});
    const providers = [];
    for (const farmId of Object.keys(queryResultByFarm)) {
        const farm = await _getFarmById(farmId);
        const farmItems = queryResultByFarm[farmId];
        LOG.info({farmItems});
        const itemsAsync = farmItems.map( async (inventoryItem) => {
            const product = await _getProduct(inventoryItem.data!.productId);
            LOG.info({product});
            return {
                "id": inventoryItem.data!.itemId,
                "descriptor": {
                    "name": product!.data!.productName,
                },
                "location_id": `loc:${farmId}`,
                "price": {
                    "currency": "INR",
                    "value": (inventoryItem.data!.priceInPaise + CONSTANTS.buyerFinderFee * inventoryItem.data!.priceInPaise) / 100 ,
                },
                "category_id": categoryId,
                "fulfillment_id": 'fv_ff',
                "@ondc/org/returnable": "false",
                "@ondc/org/cancellable": "false",
                "@ondc/org/time_to_ship": `${product?.data?.idealDelTat || ''}d`,
                "@ondc/org/available_on_cod": "true",
                "@ondc/org/contact_details_consumer_care": `${farm?.data?.supportPhone || ''} | ${farm?.data?.supportEmail || ''}`,
                "@ondc/org/mandatory_reqs_veggies_fruits": {
                    "net_quantity": product?.data?.packSize || '',
                },
                "tags": {
                    "packSize": product?.data?.packSize || '',
                    "productDescription": product?.data?.productDescription || '',
                    "imageUrl": product?.data?.imageUrl || '',
                    "grading": product?.data?.grading || '',
                    "variant": product?.data?.variant || '',
                    "perishability": product?.data?.perishability || '',
                    "logisticsNeed": product?.data?.logisticsNeed || '',
                    "coldChain": product?.data?.coldChain || '',
                    "idealDeliveryTurnAroundTime": `${product?.data?.idealDelTat}d` || '1d'
                },
                "matched": true,
            }
        });
        const items = await Promise.all(itemsAsync);
        LOG.info({items});
        const provider = {
            "id": farm!.data!.providerId,
            "descriptor": {
                "name": farm!.data!.farmName
            },
            "locations": [
                {
                    "id": `loc:${farmId}`,
                    "gps": farm!.data!.farmLocation, // string lat,lng
                }
            ],
            "items": items
        }
        providers.push(provider);
    }
    return {
        "catalog": {
            "bpp/descriptor": {
                "name": "dhoomnow.com",
                "short_desc": "",
                "long_desc": "",
                "symbol": "",
            },
            "bpp/providers": providers
        }
    };
}

const _searchByItemName = async (itemName: string) => {
    LOG.info({msg: '_searchByItemName', itemName});
    const queryResult = await farmInventoryRepo.searchByItemName(itemName);
    LOG.info({msg: '_searchByItemName queryResult', queryResult});
    if (queryResult !== null) {
        return _makeCatalogResponseFromFarmInventoryList(queryResult);
    }
    return null;
};

const _searchByPriceRange = async (itemName: string, startPriceInPaise: number, endPriceInPaise: number) => {
    const queryResults = await farmInventoryRepo.searchByPriceRange(itemName, startPriceInPaise, endPriceInPaise);
    if (queryResults !== null) {
        return _makeCatalogResponseFromFarmInventoryList(queryResults);
    }
    return null;
};
const _searchByItemId = async (itemId: string) => {
    const item = await farmInventoryRepo.searchByItemId(itemId)
    if(item !== null) {
        return _makeCatalogResponseFromFarmInventoryList([item]);
    }
    return null;
};

const _makeCatalogResponseFromProviderList = (queryResults: Farm[] | null)=> {
    if (queryResults === null) {
        return null;
    }
    const providers = queryResults.map(provider => {
        return {
            "id": provider!.data!.providerId,
            "descriptor": {
                "name": provider.data!.farmName
            },
            "locations": [
                {
                    "id": makeEntityId('loc', provider.data!.id.toString()),
                    "gps": provider.data!.farmLocation,
                }
            ]
        }
    });
    return {
        "catalog": {
            "bpp/descriptor": {
                "name": "dhoomnow.com",
                "short_desc": "",
                "long_desc": "",
                "symbol": "",
            },
            "bpp/providers": providers
        }
    };
}

const _searchByStoreName = async (storeName: string) => {
    const queryResults = await farmRepo.searchByStoreName(storeName);
    return _makeCatalogResponseFromProviderList(queryResults);
}

const _searchStoreByRating = async (rating: number) => {
    const queryResults = await farmRepo.searchByRating(rating);
    return _makeCatalogResponseFromProviderList(queryResults);
}

const _getAll =  async () => {
    const queryResults = await farmRepo.getAll();
    return _makeCatalogResponseFromProviderList(queryResults);
}

const _searchStoreByLocation = () => {
    return _getAll();
}

const _searchByStoreId = async (storeId: string) => {
    LOG.info({msg: '_searchByStoreId', storeId});
    const queryResults = await farmRepo.getByProviderId(storeId);
    return queryResults === null ? null : _makeCatalogResponseFromProviderList([queryResults]);
}

const _makeCatalogResponseForCategory = async (providers: Farm[]) => {
    return providers.map(provider => {
        return {
            "id": provider!.data!.providerId,
            "descriptor": {
                "name": provider.data!.farmName
            },
            "categories": [
                {
                    "id": categoryId,
                    "descriptor": {
                        "name": categoryId
                    }
                }
            ],
            "matched": true
        }
    });
}

const _searchByCategoryId = async (id: string) => {
    if (id === categoryId) {
        const query = await farmRepo.getAll();
        if (query !== null) {
            return await _makeCatalogResponseForCategory(query);
        }
    }
    return null
}

const _searchByCategoryName = async (name: string) => {
    if (categoryId.toLowerCase().includes(name.toLowerCase())) {
        const query = await farmRepo.getAll();
        if (query !== null) {
            return await _makeCatalogResponseForCategory(query);
        }
        return _getAll();
    }
    return null;
}

const searchForListOfItems = async (payload: any, type: string) => {
    /**
     *         'searchByItemName',
     *         'searchByPriceRange',
     *         'searchByItemId'
     */
    switch (type) {
        case 'searchByItemName': {
            const itemName = payload?.message?.intent?.item?.descriptor?.name || '';
            return _searchByItemName(itemName);
        }
        case 'searchByPriceRange': {
            const itemName = payload?.message?.intent?.item?.descriptor?.name || '';
            const min = parseFloat(payload?.message?.intent?.item?.price?.minimum_value || '0') * 100;
            const max = parseFloat(payload?.message?.intent?.item?.price?.maximum_value || '999999999') * 100;
            return _searchByPriceRange(itemName, min, max);
        }
        case 'searchByItemId': {
            const itemId = payload?.message?.intent?.item?.id || '';
            return _searchByItemId(itemId);
        }
        default:
            return null;
    }
};

const searchForListOfStores = async (payload: any, type: string) => {
    /**
     * 'searchByStoreName',
     *         'searchByPickupLocation',
     *         'searchByDeliveryLocation',
     *         'searchByFulfillmentMethod',
     *         'searchByStoreId',
     *         'searchByStoreRating',
     */
    switch (type) {
        case 'searchByStoreName': {
            const itemName = payload?.message?.intent?.provider?.descriptor?.name || '';
            return _searchByStoreName(itemName);
        }
        case 'searchByPickupLocation':
        case 'searchByDeliveryLocation':
        case 'searchByFulfillmentMethod': {
            return _searchStoreByLocation();
        }
        case 'searchByStoreId': {
            const storeId = payload?.message?.intent?.provider?.id
            return _searchByStoreId(storeId);
        }
        case 'searchByStoreRating': {
            const rating = payload?.message?.intent?.provider?.rating
            return _searchStoreByRating(rating);
        }
        default:
            return null;
    }
}

const searchForListOfCategory = async (payload: any, type: string) => {
    /**
     * 'searchByCategoryName',
     *         'searchByCategoryId'
     */
    switch (type) {
        case 'searchByCategoryName': {
            const itemName = payload?.message?.intent?.category?.descriptor?.name || '';
            return _searchByCategoryName(itemName);
        }
        case 'searchByCategoryId': {
            const storeId = payload?.message?.intent?.category?.id
            return _searchByCategoryId(storeId);
        }
        default:
            return null;
    }
}
