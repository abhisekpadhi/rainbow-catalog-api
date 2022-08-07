import * as jose from 'jose';
import {LOG} from './logger';

const jwtSecret = process.env.JWT_SECRET!;

export interface ITokenPayloadData {
    farmerId: string;
}

export const constructJwt = async (payload: { [k: string]: unknown }) => {
    const expDelta = 90 * 24 * 60 * 60 * 1000; // 90 days
    return  new jose.SignJWT({data: payload})
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt(Date.now())
        .setExpirationTime(Date.now() + expDelta)
        .sign(Buffer.from(jwtSecret));
}

export const validateJwt = async (token: string): Promise<ITokenPayloadData | null> => {
    try {
        const result = await jose.jwtVerify(token, Buffer.from(jwtSecret), {
            algorithms: ['HS256'],
        });
        return result.payload.data as ITokenPayloadData;
    } catch (e) {
        LOG.info(`failed jwt validation, err:${e}`);
    }
    return null
}
