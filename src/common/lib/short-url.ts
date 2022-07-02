import {CONSTANTS} from '../../CONSTANTS';
import {http} from './http';
import {LOG} from './logger';

export interface IFirebaseDynamicLinkApiResponse {
    shortLink: string;
    previewLink: string;
}

// firebase dynamic link api call
const createFirebaseDynamicLink = async (link: string) => {
    const key = process.env.FIREBASE_KEY!;
    const domainUriPrefix = process.env.FIREBASE_DOMAIN_URI_PREFIX;
    const androidPackageName = CONSTANTS.androidPackageName;
    const iosPackageName = CONSTANTS.iosPackageName;
    const url = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${key}`;
    const payload = {
        "dynamicLinkInfo": {
            "domainUriPrefix": domainUriPrefix,
            "link": link,
            "androidInfo": {
                "androidPackageName": androidPackageName
            },
            "iosInfo": {
                "iosBundleId": iosPackageName
            }
        },
        "suffix": {
            "option": "SHORT"
        }
    }
    return http.post<IFirebaseDynamicLinkApiResponse>(url, payload);
}

export const generateShortUrl = async (longUrl: string) => {
    let short = null;
    try {
        short = (await createFirebaseDynamicLink(longUrl)).shortLink;
    } catch (e) {
        LOG.info({msg: 'failed to generate short url', error: e});
    }
    return short;
}
