/**
 * Notes:
 * - algorithm is chosen first which remains constant
 * - password is chosen which remains constant
 * - a key is generated using a secret password which is fixed, a salt which should be randomly generated for the data.
 * - a iv (initialized vector) is randomly generated for the data.
 * - cipher function is created using inputs - algo, key, iv
 * - cipher func. used to encrypt data
 * - share iv with the user along with the encrypted data, preferably in format iv.encryptedData (. dot separator)
 * - store salt and uid (a unique identifier for the user) in db
 * - for decryption, expect user to give us uid and encrypted data
 * - we fetch salt against the uid from db, split payload by . (dot) to extract iv & encrypted data
 * - create decipher function using algo, key, iv & decrypt the data
 */
// import * as crypto from 'crypto';
// import {CONSTANTS} from '../../CONSTANTS';
// import {LOG} from './logger';
//
// const jwtSecret = process.env.JWT_SECRET!;
// const algorithm = process.env.CRYPTO_ALGO!; //algorithm to use
// const password = process.env.CRYPTO_SECRET!;
//
// const _generateKey = ( namak?: string ) => {
//     const salt = namak === undefined ? crypto.randomBytes(16) : namak; // generate random salt everytime
//     return {key: crypto.scryptSync(password, salt, 24), salt}; //create key
// }
//
// const _generateIv = () => {
//     return crypto.randomBytes(16); // generate different ciphertext everytime
// }
//
// const generateFreshSecrets = () => {
//     const iv = _generateIv();
//     const {key, salt} = _generateKey();
//     return {iv, salt, key};
// }
//
// export interface ITokenPayloadData {
//     farmerId: string;
// }

// const _encrypt = (data: string, cipher: crypto.Cipher) => cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
// const _decrypt = (encrypted: string, decipher: crypto.Decipher) => decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');

// const encrypt = (data: string) => {
//     const { key, iv } = generateSecrets();
//     const cipher = crypto.createCipheriv(algorithm, key, iv);
//     return cipher.update(data, 'utf8', 'hex') + cipher.final('hex'); // encrypted text
// }
//
// const decrypt = (encrypted: string) => {
//     const decipher = crypto.createDecipheriv(algorithm, key, iv);
//     return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8'); //deciphered text
// }


