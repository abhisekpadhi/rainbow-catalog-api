import {Farm, IFarm, IFarmer, IFarmPrefs} from '../models/farmer-account';
import FarmerRepo from '../repository/farmer-repo';
import FarmRepo from '../repository/farm-repo';
import FarmPrefsRepo from '../repository/farm-prefs-repo';

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
