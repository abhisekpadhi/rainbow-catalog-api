import express, {Request, Response} from 'express';
import {ApiRoutes} from '../ApiRoutes';
import {health} from '../workflows/health';
import {Responder} from '../common/lib/responder';
import {FarmerSchema, FarmPrefsSchema, FarmSchema, InventoryUpdateRequestSchema} from '../models/farmer-account';
import {
    createOrUpdateFarm, getFarmInventory,
    getFarmPrefs,
    getFarmsOfFarmer, getInventoryLedger, getProduct,
    login, updateCatalog,
    updateFarmPrefs, updateInventory
} from '../workflows/account-worflows';
import {LOG} from '../common/lib/logger';
import multer  from 'multer';
import * as fs from 'fs';
import * as csv from 'fast-csv';


const upload = multer({ dest: '/tmp/' })
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

const handleCatalogUpload = async  (req: Request, res: Response) => {
    if (req.file) {
        fs.createReadStream(req.file.path)
            .pipe(csv.parse({headers: true}))
            .on('error', error => LOG.info({error}))
            .on('data', row => updateCatalog(row))
            .on('end', (rowCount: number) => {
                LOG.info(`Parsed ${rowCount} rows`)
                fs.unlinkSync(req.file!.path);   // remove temp file
            });
    }
    res.send({message: 'ok'});
}

const handleGetProductSku = async  (req: Request, res: Response) => {
    await Responder.ofGet(req, res, getProduct)
}

const handleGetInventory = async  (req: Request, res: Response) => {
    await Responder.ofGet(req, res, getFarmInventory)
}

const handleGetInventoryLedger = async  (req: Request, res: Response) => {
    await Responder.ofGet(req, res, getInventoryLedger)
}

const handleUpdateInventory = async  (req: Request, res: Response) => {
    await Responder.ofPost(req, res, InventoryUpdateRequestSchema, updateInventory)
}



// add routes here
router.post('/login', loginHandler);
router.get('/farms', getFarmHandler);
router.post('/farms/update', updateFarmHandler);
router.get('/farms/prefs', getPrefsHandler);
router.post('/farms/prefs/update', updateFarmPrefsHandler);
router.post('/catalog/upload', upload.single('file'), handleCatalogUpload);
router.get('/catalog/sku', handleGetProductSku);
router.get('/inventory', handleGetInventory);
router.get('/inventory/ledger', handleGetInventoryLedger);
router.post('/inventory/update', handleUpdateInventory);

export { router };
