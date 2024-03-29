import express, {Request, Response} from 'express';
import {makeAck} from './response-makers';
import {TaskQ} from '../common/lib/taskq';
import {LOG} from '../common/lib/logger';

const router = express.Router();

export const ondcHandler = async (req: Request, res: Response) => {
    const {baseUrl: path, body} = req;
    const payload = {path: path.replace('/api', ''), body};
    LOG.info({msg: 'taskPayload to enqueue', payload});
    await TaskQ.enqueue(JSON.stringify(payload));
    // respond ack
    res.status(200);
    res.send(makeAck());
}

router.use('*', ondcHandler);
export const OndcRouter = router;
