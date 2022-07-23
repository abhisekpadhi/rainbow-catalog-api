import {createClient} from 'redis';
import {LOG} from './lib/logger';

const cache = createClient({url: process.env.REDIS_ENDPOINT});

(async () => {
    await cache.connect();
    LOG.info('redis connected')
})();

export { cache }
