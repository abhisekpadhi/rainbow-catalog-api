import {Request, Response, NextFunction} from 'express';
import {LOG} from '../common/lib/logger';
import {UnAuthenticatedRoutes} from '../ApiRoutes';
import {validateJwt} from '../common/lib/jwt';

// apart from few unauthenticated routes, rest all routes are supposed to authenticated
export async function authInterceptor(req: Request, res: Response, next: NextFunction) {
    if (UnAuthenticatedRoutes.includes(req.path)) {
        next();
        return;
    }
    const jwt = req.headers?.authorization?.replace('Bearer ', '');
    if (jwt !== undefined && jwt.length > 0) {
        try {
            const payload = await validateJwt(jwt);
            if (payload !== null) {
                if ('farmerId' in payload) {
                    (req as any)['farmerId'] = payload['farmerId'];
                    next();
                    return;
                }
            }
        } catch (e) {
            LOG.info({error: e});
        }
    }
    LOG.info('authInterceptor token invalid');
    res.status(401).send('Invalid token');
}

