import {Farm, IFarm, IFarmer, IFarmPrefs, IProductCatalog, ProductCatalog} from '../models/farmer-account';
import FarmerRepo from '../repository/farmer-repo';
import FarmRepo from '../repository/farm-repo';
import FarmPrefsRepo from '../repository/farm-prefs-repo';
import {LOG} from '../common/lib/logger';
import ProductCatalogRepo from '../repository/product-catalog-repo';

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
    await ProductCatalogRepo.updateProduct(obj.toPlainObject()!)
}

export const getProduct = async (payload: { skuId: string }) => {
    const res = await ProductCatalogRepo.getByProductId(payload.skuId)
    if (res) {
        return res.toPlainObject()!;
    } else {
        return null;
    }
}
