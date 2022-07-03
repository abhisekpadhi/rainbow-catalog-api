import {
    Farm,
    IFarm,
    IFarmer, IFarmInventory, IFarmInventoryLedger,
    IFarmPrefs, IInventoryResponse, IInventoryUpdateRequest,
    IProductCatalog,
    ProductCatalog,
    ProductCatalogSchema
} from '../models/farmer-account';
import FarmerRepo from '../repository/farmer-repo';
import FarmRepo from '../repository/farm-repo';
import FarmPrefsRepo from '../repository/farm-prefs-repo';
import {LOG} from '../common/lib/logger';
import ProductCatalogRepo from '../repository/product-catalog-repo';
import FarmInventoryRepo from '../repository/farm-inventory-repo';
import {cache} from '../common/clients';

export const login = async (payload: IFarmer) => {
    let farmer = await FarmerRepo.getByPhone(payload.phone)
    if (farmer) {
        return {farmer: farmer.toPlainObject()}
    } else {
        await FarmerRepo.updateFarmer(payload)
        farmer = await FarmerRepo.getByPhone(payload.phone)
        return {farmer: farmer?.toPlainObject()}
    }
}

export const getFarmsOfFarmer = async (payload: {farmerId: number}) => {
    let farms: IFarm[] = [];
    const res =await FarmRepo.getByFarmerId(payload.farmerId);
    if (res) {
        farms = res.map(o => o.toPlainObject()!);
    }
    return {farms}
}

export const createOrUpdateFarm = async (payload: IFarm) => {
    if (payload.id !== 0) {
        // update existing
        const existing = await FarmRepo.getByFarmId(payload.id);
        if (existing) {
            const updated = new Farm({...existing.toPlainObject(), ...payload});
            await FarmRepo.updateFarm(updated.toPlainObject()!);
        }
    } else {
        // create new
        const farm = new Farm(payload);
        await FarmRepo.updateFarm(farm.toPlainObject()!);
    }
}

export const getFarmPrefs = async (payload: {farmId: number}) => {
    let prefs: IFarmPrefs[] = [];
    const res = await FarmPrefsRepo.getByFarmId(payload.farmId);
    if (res) {
        prefs = res.map(o => o.toPlainObject()!);
    }
    return {prefs}
}

export const updateFarmPrefs = async (payload: IFarmPrefs) => {
    await FarmPrefsRepo.updateFarmPrefs(payload);
    return "ok"
}

export const updateCatalog = async (row: any) => {
    const product: Partial<IProductCatalog> = {}
    // parse data from excelsheet
    if ('sku id' in row) {
        // ignore rows with no sku id
        if (row['sku id'].length === 0) {
            return;
        }
        product.skuId = row['sku id'];
    }
    if ('crop name' in row) {
        product.productName = row['crop name'];
    }
    if ('crop pic url' in row) {
        product.imageUrl = row['crop pic url'];
    }
    if ('pack size' in row) {
        product.packSize = row['pack size'];
    }
    if ('pack size' in row) {
        product.packSize = row['pack size'];
    }
    if ('description' in row) {
        product.productDescription = row['description']
    }
    if ('grade' in row) {
        product.grading = row['grade']
    }
    let variant = '';
    if ('Variety' in row) {
        variant = variant + row['Variety'];
    }
    if ('variant' in row) {
        variant = variant + row['variant'];
    }
    product.variant = variant;
    if ('perishability (days)' in row) {
        product.perishability = row['perishability (days)']
    }
    if ('logistics' in row) {
        product.logisticsNeed = row['logistics'];
    }
    if ('cold chain req' in row) {
        product.coldChain = row['cold chain req'];
    }
    if ('ideal del tat (day)' in row) {
        product.idealDelTat = row['ideal del tat (day)']
    }
    LOG.info({product})
    const obj = new ProductCatalog(product)
    // update db
    await ProductCatalogRepo.updateProduct(obj.toPlainObject()!)
    // update cache
    if (obj.data && obj.data.skuId) {
        await cache.set(generateRedisKeyForSku(obj.data.skuId), obj.toJSON()!)
    }
}

const generateRedisKeyForSku = (skuId: string) => {
    return `rainbowcatalog:product:${skuId}`
}

export const getProduct = async (payload: { skuId: string }) => {
    // try cache first
    const fromCache = await cache.get(generateRedisKeyForSku(payload.skuId))
    if (fromCache !== null && fromCache.length > 0) {
        LOG.info({msg: 'cache hit', data: fromCache})
        return ProductCatalogSchema.parse(JSON.parse(fromCache));
    }

    // otherwise fetch from db
    LOG.info({msg: 'cache miss'})
    const res = await ProductCatalogRepo.getByProductId(payload.skuId)
    if (res) {
        return res.toPlainObject()!;
    } else {
        return null;
    }
}

export const getFarmInventory = async (payload: {farmId: number}) => {
    let res: IInventoryResponse[] = []
    let inventory = await FarmInventoryRepo.getInventoryByFarm(payload.farmId)
    if (inventory) {
        for (const sku of inventory) {
            if (sku && sku.data) {
                const product = await getProduct({skuId: sku.data.productId})
                if (product) {
                    res.push({...product, qty: sku.data.qty})
                }
            }
        }
    }
    return {inventory: res}
}

export const getInventoryLedger = async (payload: {farmId: number}) => {
    let ledger: IFarmInventoryLedger[] = [];
    const res = await FarmInventoryRepo.getLedger(payload.farmId);
    if (res) {
        ledger = res.map(o => o.toPlainObject()!);
    }
    return {ledger}
}

export const updateInventory = async (payload: IInventoryUpdateRequest) => {
    const inventory = await FarmInventoryRepo.getInventorySku(payload.farmId, payload.productId);
    if (inventory === null && payload.op === 'remove') {
        return "cannot remove from oos sku"
    }
    if (inventory && inventory.data) {
        if (payload.op === 'remove' && payload.qty > inventory.data.qty) {
            return "cannot remove more than available"
        }
    }
    const opening = inventory?.data?.qty || 0
    const updateQty = payload.op === 'add' ? opening + payload.qty : opening - payload.qty;
    const inventoryUpdate: IFarmInventory = {
        ...inventory,
        id: 0,
        farmId: payload.farmId,
        priceInPaise: payload.priceInPaise,
        productId: payload.productId,
        qty: updateQty
    }
    const ledgerEntry: IFarmInventoryLedger = {
        id: 0,
        farmId: payload.farmId,
        productId: payload.productId,
        qty: payload.qty,
        op: payload.op,
        opening,
        createdAt: Date.now()
    }
    await FarmInventoryRepo.updateFarmInventory(ledgerEntry, inventoryUpdate)
    return "ok";
}
