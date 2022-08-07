import {CONSTANTS} from '../../CONSTANTS';
import {LOG} from './logger';

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
