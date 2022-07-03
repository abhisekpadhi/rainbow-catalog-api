import express, {Request, Response} from 'express';
import {ApiRoutes} from '../ApiRoutes';
import {health} from '../workflows/health';
import {Responder} from '../common/lib/responder';
import {FarmerSchema, FarmPrefsSchema, FarmSchema} from '../models/farmer-account';
import {
    createOrUpdateFarm,
    getFarmPrefs,
    getFarmsOfFarmer,
    login,
    updateFarmPrefs
} from '../workflows/account-worflows';
import {LOG} from '../common/lib/logger';

const router = express.Router();

const loginHandler = async (req: Request, res: Response) => {
    await Responder.ofPost(req, res, FarmerSchema, login)
}

const getFarmHandler =  async (req: Request, res: Response) => {
    await Responder.ofGet(req, res, getFarmsOfFarmer)
}

const updateFarmHandler =  async (req: Request, res: Response) => {
    await Responder.ofPost(req, res, FarmSchema, createOrUpdateFarm)
}

const getPrefsHandler = async (req: Request, res: Response) => {
    await Responder.ofGet(req, res, getFarmPrefs)
}

const updateFarmPrefsHandler =  async (req: Request, res: Response) => {
    await Responder.ofPost(req, res, FarmPrefsSchema, updateFarmPrefs)
}

// add routes here
// login/create farmer
router.post('/login', loginHandler);
router.get('/farms', getFarmHandler);
router.post('/farms/update', updateFarmHandler);
router.get('/farms/prefs', getPrefsHandler);
router.post('/farms/prefs/update', updateFarmPrefsHandler);

export { router };
