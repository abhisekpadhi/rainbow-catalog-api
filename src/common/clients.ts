import * as AWS from 'aws-sdk';
import {createClient} from 'redis';

AWS.config.update({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!
    },
    maxRetries: 2,
    httpOptions: {
        timeout: 60000, // 60sec.
        connectTimeout: 10000 // 10sec.
    }
});
AWS.config.logger = console;

const s3 = new AWS.S3();
const cache = createClient({url: process.env.REDIS_ENDPOINT});

export {cache, s3}
