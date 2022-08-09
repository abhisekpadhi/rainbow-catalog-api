import express, {Request, Response} from 'express';
import {Responder} from '../common/lib/responder';
import {
    FarmerLoginSchema,
    FarmerSchema,
    FarmSchema,
    InventoryUpdateRequestSchema,
    SellerOrderStatusUpdateRequestSchema
} from '../models/farmer';
import {
    createOrUpdateFarm, getFarmerOrders,
    getFarmInventory,
    getFarmPrefs,
    getFarmsOfFarmer,
    getInventoryLedger,
    getProduct,
    login,
    otpRequest,
    updateCatalog,
    updateFarmInventory, updateSellerOrderStatus
} from '../workflows/farmer-worflows';
import {LOG} from '../common/lib/logger';
import multer  from 'multer';
import * as fs from 'fs';
import * as csv from 'fast-csv';
import {ZodObject} from 'zod';
import _ from 'lodash';
import {ApiRoutes} from '../ApiRoutes';

const upload = multer({ dest: '/tmp/' })
const router = express.Router();

const RequestPathHandlerMapping: {[k: string]: { hf: (payload: any) => any  | undefined, s?: ZodObject<any>}} = {
    ['post:'+ApiRoutes.otpRequest]: {
        hf: otpRequest,
        s: FarmerSchema
    },
    ['post:'+ApiRoutes.login]: {
        hf: login,
        s: FarmerLoginSchema
    },
    'get:/farms': {
        hf: getFarmsOfFarmer,
    },
    'post:/farms/update': {
        hf: createOrUpdateFarm,
        s: FarmSchema,
    },
    'get:/farm/prefs': {
        hf: getFarmPrefs
    },
    'get:/catalog/sku': {
        hf: getProduct
    },
    'get:/inventory': {
        hf: getFarmInventory
    },
    'get:/inventory/ledger': {
        hf: getInventoryLedger
    },
    'post:/inventory/update': {
        hf: updateFarmInventory,
        s: InventoryUpdateRequestSchema
    },
    'get:/seller/orders': {
        hf: getFarmerOrders,
    },
    'post:/seller/orders/status': {
        hf: updateSellerOrderStatus,
        s: SellerOrderStatusUpdateRequestSchema,
    }
}

const commonHandler = async (req: Request, res: Response) => {
    LOG.info({body:req.body});
    const method = req.method.toLowerCase();
    const handler = RequestPathHandlerMapping[`${method}:${req.path}`];
    if (handler === undefined || handler === null || (method === 'post' && handler.s === undefined)) {
        LOG.info({msg: 'commonHandler invalid request'});
        res.status(400).send('Invalid request');
        return;
    }
    if (!_.isEmpty(handler)) {
        if (method.toLowerCase() === 'get') {
            await Responder.ofGet(req, res, handler.hf);
        }
        if (method.toLowerCase() === 'post') {
            await Responder.ofPost(req, res, handler.s!, handler.hf)
        }
    }
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

// add special routes here
router.post('/catalog/upload', upload.single('file'), handleCatalogUpload);
router.get('/ondc-site-verification.html', (req, res) => {
    res.render('ondc-site-verification');
});

// add generic routes to commonHandler
router.use('', commonHandler);

export { router };
