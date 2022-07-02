import express, {Request, Response} from 'express';
import {ApiRoutes} from '../ApiRoutes';
import {health} from '../workflows/health';

const router = express.Router();

const healthHandler = async (req: Request, res: Response) => {
    res.send({data: await health()})
}

const testHandler = async (req: Request, res: Response) => {

}

// add routes here
router.post('/test', testHandler);

// add routes here
router.get(ApiRoutes.health, healthHandler);

export { router };
