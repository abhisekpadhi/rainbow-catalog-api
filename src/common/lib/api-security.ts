import {Request, Response, NextFunction} from 'express';
import {LOG} from './logger';

export function authInterceptor(req: Request, res: Response, next: NextFunction) {
    // todo: implement
    LOG.info('authInterceptor called...');
    next();
}
