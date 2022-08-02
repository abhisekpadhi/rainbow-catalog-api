import {createClient} from 'redis';
import {LOG} from './lib/logger';
import {CONSTANTS} from '../CONSTANTS';

const cache = createClient({url: CONSTANTS.cache});

(async () => {
    await cache.connect();
    LOG.info('redis connected')
})();

export { cache }
