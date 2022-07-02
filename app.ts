import express from 'express';
import {authInterceptor} from './src/common/lib/api-security';
import {loggerMidlleware} from './src/common/lib/logger';
import helmet from 'helmet';
import handleError from './errors';

const app = express()

// json body parser
app.use(express.json());

// intercept for jwt auth
app.use(authInterceptor);

// add logger to express
app.use(loggerMidlleware);

// security
app.disable('x-powered-by')
app.use(helmet());

// error handling
app.use(handleError)

export {app};
