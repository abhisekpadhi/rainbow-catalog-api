import 'dotenv/config';
import {app} from './app';
import {RootRouter} from './src/resources';
import {OndcRouter} from './src/ondc-proto/ondc-router';
import {LOG} from './src/common/lib/logger';
import orderRepo from './src/repository/order-repo';
import {OrderStatus} from './src/models/farmer';
import {DB} from './src/common/lib/db';
import {cache} from './src/common/clients';
import {CONSTANTS} from './src/CONSTANTS';

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
});

// health check
app.get('/_/healthz', async (req, res) => {
    const result = {
        db: 'fail',
        cache: 'fail',
        mq: 'fail',
    };
    try {
        await DB.fnf(
            'select 1 from mysql.user limit 1',
        );
        result.db = 'ok';
    } catch (e) {
        LOG.info({msg: 'db exception', error: e});
    }
    try {
        await cache.info()
        result.cache = 'ok';
    } catch (e) {
        LOG.info({msg:'cache exception', error: e});
    }
    try {
        let flag = 0;
        const subscriber  = cache.duplicate();
        await subscriber.connect();
        await subscriber.subscribe(CONSTANTS.testChannel, async () => {
            flag = 1;
        });
        await cache.publish(CONSTANTS.testChannel, '');
        // wait for 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (flag === 1) {
            result.mq = 'ok'
        }
    } catch (e) {
        LOG.info({msg: 'mq exception', error: e});
    }
    res.json(result);
});

// api reachability
app.get('/_/ping', async (req, res) => {
    res.send('pong');
});
// start server
app.listen(port, host, () => {
    console.log(`⚡️ Server running from main.ts at http://${host}:${port}`);
});
