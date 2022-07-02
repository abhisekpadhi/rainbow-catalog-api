import {generateRandomNDigits} from './jwt';
import util from 'util';
import {sendSms} from '../comm/sms';
import {cache} from '../clients';
import {CONSTANTS} from '../../CONSTANTS';
import {ILoginOtpRequest, ILoginWithOtpRequest} from '../../models/login';
import {LOG} from './logger';

const generateOtpCacheKey = (phone: string) => `otp:${phone}`

const getOtpFromCache = async (phone: string) => {
    const key = generateOtpCacheKey(phone);
    LOG.info({otpKey: key});
    return await cache.get(key);
}

const setOtpInCache = async (phone: string, otp: string) => {
    const key = generateOtpCacheKey(phone);
    await cache.setEx(key, CONSTANTS.otpExpiresInSeconds, otp);
}

export const sendOtp = async (phone: string) => {
    const existing = await getOtpFromCache(phone);
    const otp = existing ? existing : generateRandomNDigits();
    const message = util.format(CONSTANTS.sms.template.otp, otp)
    await setOtpInCache(phone, otp)
    await sendSms({phone, message});
}

export const otpVerified = async (req: ILoginWithOtpRequest) => {
    return req.phone ? await getOtpFromCache(req.phone) === req.otp : false;
}
