import 'dotenv/config';
import {app} from './app';
import {RootRouter} from './src/resources';
import {OndcRouter} from './src/ondc-proto/ondc-router';
import {LOG} from './src/common/lib/logger';
import orderRepo from './src/repository/order-repo';
import {OrderStatus} from './src/models/farmer';

const port = process.env.PORT! as unknown as number;
const host = process.env.HOST! as unknown as string;

app.use('', RootRouter);
app.use('/api', OndcRouter);
app.get('/tracking', async (req, res) => {
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
        status: OrderStatus.active,
    }
    return res.render('track', { data });
})

// start server
app.listen(port, host, () => {
    console.log(`⚡️ Server running from main.ts at http://${host}:${port}`);
});
