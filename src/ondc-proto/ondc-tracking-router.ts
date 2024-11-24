import express, {Request, Response} from 'express';
import {LOG} from '../common/lib/logger';
import orderRepo from '../repository/order-repo';

const router = express.Router();

const trackingHandler = async (req: Request, res: Response) => {
    const orderId = req.query.orderId;
    LOG.info({msg: `tracking order ${orderId}`});
    if (orderId === undefined) {
        return res.status(400).render('400');
    }
    const order = await orderRepo.getOrderById(orderId as string);
    if (order === null) {
        return res.status(404).render('404');
    }
    const data = {
        orderId: orderId,
        status: order.data?.orderStatus,
    }
    return res.render('track', { data });
};

router.use('/', trackingHandler);
export const OndcTrackingRouter = router;
