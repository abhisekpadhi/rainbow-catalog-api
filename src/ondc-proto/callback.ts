import {HEADERS, IOndcPayloadContext, PROTOCOL_CONTEXT} from './models';
import {createAuthorizationHeader} from './crypto';
import HttpRequest from './HttpRequest';
import {LOG} from '../common/lib/logger';
import {update} from 'lodash';

const makeBaseUri = (baseUrl: string) => {
    return baseUrl ? baseUrl.endsWith("/") ? baseUrl : baseUrl + "/" : "";
}

/**
 * constructs auth header & makes a callback on bap endpoint
 * @param action: ONDC protocol context action
 * @param body: payload of response to the query BAP had made earlier
 */
export const bapCallback = async (action: PROTOCOL_CONTEXT, body: { context: IOndcPayloadContext, message: object}) => {
    const header = {[HEADERS.AUTH_TOKEN]: await createAuthorizationHeader(body.message)};
    LOG.info({msg: 'bapCallback', header});
    const updatedBody = {...body, context: {...body.context, action}}; // update action of context to ON_XXX
    const request = new HttpRequest(makeBaseUri(body.context.bap_uri), action, 'POST', updatedBody, header);
    // fire n forget
    try {
        await request.send();
    } catch (e) {
        LOG.info({msg: 'exception in bapCallback', error: e});
    }
};
