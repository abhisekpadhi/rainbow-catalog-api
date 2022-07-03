import {createClient} from 'redis';
import {LOG} from './lib/logger';

const cache = createClient({url: process.env.REDIS_ENDPOINT});

cache.connect().then(_ => { LOG.info('redis connected')});

export { cache }
