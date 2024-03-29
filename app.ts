import express from 'express';
import {authInterceptor} from './src/resources/api-security';
import {loggerMidlleware} from './src/common/lib/logger';
import helmet from 'helmet';
import handleError from './errors';
import {ondcInterceptor} from './src/ondc-proto/interceptor';
import './src/common/clients';
import './src/ondc-proto/ondc-worker';
import './src/workflows/workers';

const app = express()

// json body parser
app.use(express.json());

// intercept for jwt auth
app.use(ondcInterceptor);
app.use(authInterceptor);

// add logger to express
app.use(loggerMidlleware);

// security
app.disable('x-powered-by')
app.use(helmet());

// error handling
app.use(handleError)

// ejs template
app.set('view engine', 'ejs');

export {app};
