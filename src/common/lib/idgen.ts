import {CONSTANTS} from '../../CONSTANTS';

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;
export const generateId = (size: number, symbls: string = CONSTANTS.symbols) => {
    let res = '';
    for (let i = 0; i < size; i++) {
        res += symbls[random(0, symbls.length - 1)]
    }
    return res;
}
export const generateRandomNDigits = (n: number = CONSTANTS.otpLen) => generateId(n, CONSTANTS.digits);
