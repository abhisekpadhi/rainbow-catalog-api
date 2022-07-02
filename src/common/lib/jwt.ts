import * as jose from 'jose';
import {JWTPayload} from 'jose';
import * as crypto from 'crypto';
import {CONSTANTS} from '../../CONSTANTS';
import {LOG} from './logger';

const jwtSecret = process.env.JWT_SECRET!;
const algorithm = process.env.CRYPTO_ALGO!; //algorithm to use
const password = process.env.CRYPTO_SECRET!;
const iv = crypto.randomBytes(16); // generate different ciphertext everytime
const key = crypto.scryptSync(password, 'namak', 24); //create key
const cipher = crypto.createCipheriv(algorithm, key, iv);
const decipher = crypto.createDecipheriv(algorithm, key, iv);

export interface ITokenPayloadData {
    userId: string;
    userRole: string;
}


const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;
export const generateId = (size: number, symbls: string = CONSTANTS.symbols) => {
    let res = '';
    for (let i = 0; i < size; i++) {
        res += symbls[random(0, symbls.length - 1)]
    }
    LOG.info(`generated id: ${res}`);
    return res;
}
export const generateRandomNDigits = (n: number = CONSTANTS.otpLen) => generateId(n, CONSTANTS.digits);

export const constructJwt = async (payload: { [k: string]: unknown }) => {
    const expDelta = 30 * 24 * 60 * 60 * 1000;
    return new jose.SignJWT({data: encrypt(JSON.stringify(payload))})
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
        const decrypted = JSON.parse(decrypt((result.payload as any).data))
        if ('userEmail' in decrypted) {
            return decrypted as ITokenPayloadData;
        }
    } catch (e) {
        LOG.info(`failed jwt validation, err:${e}`);
    }
    return null
}

const encrypt = (data: string) => {
    return cipher.update(data, 'utf8', 'hex') + cipher.final('hex'); // encrypted text
}

const decrypt = (encrypted: string) => {
    return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8'); //deciphered text
}


