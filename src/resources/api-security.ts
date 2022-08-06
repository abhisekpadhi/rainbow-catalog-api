import {Request, Response, NextFunction} from 'express';
import {LOG} from '../common/lib/logger';
import {UnAuthenticatedRoutes} from '../ApiRoutes';
import {validateJwt} from '../common/lib/jwt';

// apart from few unauthenticated routes, rest all routes are supposed to authenticated
export async function authInterceptor(req: Request, res: Response, next: NextFunction) {
    LOG.info('authInterceptor called...');
    if (UnAuthenticatedRoutes.includes(req.path)) {
        LOG.info('authInterceptor bypassed for unauthenticated route');
        next();
        return;
    }
    try {
        const jwt = req.headers.authorization;
        if (jwt === undefined) {
            throw 'Authorization header not found';
        }
        const payload = await validateJwt(jwt);
        if (payload !== null) {
            if ('farmerId' in payload) {
                LOG.info('authInterceptor token validated');
                (req as any)['farmerId'] = payload['farmerId'];
                next();
                return;
            }
        }
    } catch (e) {
        LOG.info({error: e});
    }

    res.status(401).send('Invalid token');
}

