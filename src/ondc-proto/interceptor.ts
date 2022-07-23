import {NextFunction, Request, Response} from 'express';
import {isRequestValid} from './crypto';
import {makeAck} from './response-makers';
import {z} from 'zod';
import {OndcPayloadContextSchema} from './models';
import _ from 'lodash';
import {ONDC_ERROR_CODES} from './error-codes';

/**
 * validates context schema
 * @param payload: ondc request payload
 */
const payloadValidityCheck = (payload: any): {path: string, message: string} | null => {
    let path = '';
    let message = '';
    if (!('context' in payload)) {
        path = 'context';
        message = 'context is missing in the payload';
    }
    try {
        OndcPayloadContextSchema.parse(payload.context)
    } catch (e) {
        if (e instanceof z.ZodError) {
            path = e.issues.map(o => o.path).join(' | ');
            message = e.issues.map(o => o.message).join(' | ');
        }
    }
    if (!_.isEmpty(path) || !_.isEmpty(message)) {
        return {path, message};
    } else {
        return null;
    }
}

/**
 * If BG forwarded request, use X-Gateway-Authorization header, if BPP request, use Authorization header
 * If the signing algorithm extracted from the keyId does not match the value of the algorithm field in the X-Gateway-Authorization header, then the BPP should return an error.
 * If no valid key is found, the BPP must return a NACK response with 401 Unauthorised response code.
 * If the signature is not verified, the BPP must return a NACK response with 401 Unauthorised response code with a Proxy-Authenticate header. For example, for an invalid BG signature, the BPP must return the following:
 * BPP will use the BG's public key to verify the signature. If the signature is verified, the BG is considered to be authenticated.
 * @param req: expressjs request object
 * @param res: expressjs request object
 * @param next: expressjs NextFunction
 */
export async function ondcInterceptor (req: Request, res: Response, next: NextFunction) {
    if (req.headers.host) {
        if (req.headers.host.includes(process.env.SUBSCRIBER_ID!)) {
            const valid = await isRequestValid(req.headers, req.body)
            const validityErrors = payloadValidityCheck(req.body);
            if (!valid || validityErrors !== null) {
                // LOG.info({msg: 'invalid request', req});
                // res.header('WWW-Authenticate', `Signature realm="${process.env.SUBSCRIBER_ID!}",headers="(created) (expires) digest"`)
                res.status(401);
                res.send(makeAck(false, {
                    code: ONDC_ERROR_CODES['Seller App']['30000'].Code.toString(10) || '',
                    path: validityErrors!.path,
                    message: validityErrors!.message
                }));
            }
        }
    }
    next(); // proceed ahead if valid ondc request or not relevant to ondc
}
