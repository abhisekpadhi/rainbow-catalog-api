import HttpRequest from "../HttpRequest";
import { REGISTRY_SERVICE_API_URLS } from "./routes";
import {ILookupResponse, SUBSCRIBER_TYPE} from '../models';

/**
 * lookup bpp by Id
 * @param {Object} subscriberDetails
 *
 */
const lookupBppById = async ({
    subscriber_id = '',
    type = '',
    domain = process.env.DOMAIN || 'nic2004:52110',
    city = process.env.CITY || '*',
    country = process.env.COUNTRY || 'IND'
}) => {
    const apiCall = new HttpRequest(
        process.env.REGISTRY_BASE_URL || 'https://pilot-gateway-1.beckn.nsdl.co.in',
        REGISTRY_SERVICE_API_URLS.LOOKUP,
        "POST",
        {subscriber_id, type, domain, city, country}
    );
    const result = await apiCall.send();
    return (result?.data as ILookupResponse); // axios specific
};

/**
 * lookup gateways
 * @param {Object} subscriberDetails
 *
 */
const lookupGateways = async () => {
    const apiCall = new HttpRequest(
        process.env.REGISTRY_BASE_URL || 'https://pilot-gateway-1.beckn.nsdl.co.in',
        REGISTRY_SERVICE_API_URLS.LOOKUP,
        "POST",
        {
            type: SUBSCRIBER_TYPE.BG,
            domain: process.env.DOMAIN || 'nic2004:52110',
            city: process.env.CITY || '*',
            country: process.env.COUNTRY || 'IND'
        }
    );
    const result = await apiCall.send();
    return result?.data;
};

export { lookupBppById, lookupGateways };
