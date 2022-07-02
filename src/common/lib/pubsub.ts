import {cache} from '../clients';
import {EventEmitter} from 'events';
import {LOG} from './logger';

// const ee = new EventEmitter();
// const subscriber = cache.duplicate();
// subscriber.connect().then(_ => { LOG.info('redis subscriber connected')});
// const subscribe = async () => {
//     LOG.info('subscription starting...')
//     await subscriber.subscribe('whatsappMessageReceived', (message) => {
//         LOG.info('redis channel message received', message);
//     }).then(_ => {});
// }
// subscribe().then(_ => {});
