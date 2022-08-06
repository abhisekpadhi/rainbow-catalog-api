import {randomUUID} from 'crypto';
import axios, {AxiosRequestConfig} from 'axios';

const pushbullet = async (body: string, to: string) => {
    const url = 'https://api.pushbullet.com/v2/texts';
    const headers = {'Access-Token': process.env.PUSHBULLET_ACCESS_TOKEN!, 'Content-Type': 'application/json'};
    const payload = {
        "data": {
            "addresses": [to],
            "message": body,
            "target_device_iden": process.env.PUSHBULLET_TARGET_DEVICE_IDEN!,
            "guid": randomUUID(),
        }
    }
    const config: AxiosRequestConfig = {
        baseURL: url,
        method: 'post',
        data: JSON.stringify(payload),
        responseType: 'json',
        headers,
    }
    const result = await axios(config);
    console.log(`pushbullet sms result: ${JSON.stringify(result.data)}`);
}


export function sendSms(body: string, to: string) {
    return pushbullet(body, to)
}
