// health check
import express from 'express';
import {DB} from '../common/lib/db';
import {LOG} from '../common/lib/logger';
import {cache} from '../common/clients';
import {CONSTANTS} from '../CONSTANTS';

const router = express.Router();

router.get('/healthz', async (req, res) => {
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
    let subscriber;
    try {
        subscriber = cache.duplicate()
        let flag = 0;
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
        await subscriber?.unsubscribe(CONSTANTS.testChannel);
    } catch (e) {
        LOG.info({msg: 'mq exception', error: e});
    } finally {
        await subscriber?.unsubscribe(CONSTANTS.testChannel);
    }
    res.json(result);
});

// api reachability
router.get('/ping', async (req, res) => {
    res.send('pong');
});

export const DiagnosticsRouter = router;
