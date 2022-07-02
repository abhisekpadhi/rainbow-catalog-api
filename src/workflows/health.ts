import {LOG} from '../common/lib/logger';

export async function health() {
    LOG.info('health check started...');
    let result = { mysql: false, redis: false, elasticsearch: false };
    // try {
    //     const db = await DB.get<any>('show tables');
    //     result.mysql = (db as any[]).length > 0;
    //     const c = await cache.info();
    //     result.redis = c.includes('process_id:');
    // } catch (e) {
    //     LOG.info({error: e});
    // } finally {
    //     // conn.end();
    // }
    LOG.info('health check end');
    return result;
}
