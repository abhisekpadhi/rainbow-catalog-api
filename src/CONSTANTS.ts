export const __DEV__ = !['production', 'prod'].includes(process.env.NODE_ENV || 'local');
export const CONSTANTS = Object.freeze({
    symbols: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz",
    digits: "0123456789",
    authHeader: 'AuthToken',
    joinCodeLen: 6,
    startingCoinBalance: 30,
    otpLen: 4,
    db: {
        connectionLimit : 30,
        host            : 'localhost',
        user            : 'root',
        password        : 'password',
        database        : 'rainbow-catalog'
    },
    tables: {
        farm: 'farm',
        farmer: 'farmer',
        farmInventory: 'farmInventory',
        farmInventoryLedger: 'farmInventoryLedger',
        farmPrefs: 'farmPrefs',
        productCatalog: 'productCatalog',
        ondcSubscriberInfo: 'ondcSubscriberInfo',
        order: 'order',
        orderPayment: 'orderPayment',
        farmerRating: 'farmerRating',
    },
    response: {
        ok: { message: 'ok' },
    },
    ondcRequestRedisList: 'ondcRequestList',
    ondcRequestRedisChannel: 'ondcRequestChannel',
    deliveryPromiseInDays: 7,
    name: "DhoomNow",
    gps: "12.9349377,77.6055586",
    contact: '+917978608446',
    email: 'support@subnub.com',
    trackingUrl: 'https://ondc.dhoomnow.com/tracking?orderId=%s',
});
