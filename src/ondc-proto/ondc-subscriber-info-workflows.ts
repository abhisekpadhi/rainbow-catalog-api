import {IOndcSubscriberInfo, OndcSubscriberInfo} from '../models/ondc-bridge';
import OndcSubscriberInfoRepo from './ondc-subscriber-info-repo';
import {lookupBppById} from './registryApis';
import {ILookupResponse, ISubscriberItemInLookupResponse, SubscriberItemInLookupResponse, SUBSCRIBER_TYPE} from './models';
import _ from 'lodash';
import {LOG} from '../common/lib/logger';

const fetchFromDb = async (subscriberId: string, uniqueKeyId: string) => {
    return OndcSubscriberInfoRepo.getSubscriber(subscriberId, uniqueKeyId)
}

export const getProviderPublicKey = async (provider: ISubscriberItemInLookupResponse) => {
    try {
        return provider?.signing_public_key || null;
    } catch (e) {
        return null;
    }
}

const getProvider = async (providers: ILookupResponse, keyId: string) => {
    try {
        return _.find(providers, ['ukId', keyId]) || null;
    } catch (e) {
        return null;
    }
}

const saveInDb = (payload: IOndcSubscriberInfo) => {
    return OndcSubscriberInfoRepo.updateSubscriber(payload);
}


const registryLookup = async (subscriberId: string, uniqueKeyId: string, subscriberType: string = SUBSCRIBER_TYPE.BAP) => {
    try {
        LOG.info({msg: `registryLookup for ${subscriberId} ${uniqueKeyId}`});
        const response = await lookupBppById({
            type: subscriberType,
            subscriber_id: subscriberId
        });
        LOG.info({msg: `registryLookup for ${subscriberId} ${uniqueKeyId}`, response});
        if (!response) {
            return null;
        }
        const provider = await getProvider(response, uniqueKeyId);
        if (provider === null) {
            return null;
        }
        const public_key = await getProviderPublicKey(provider)
        if (!public_key)
            return null;
        // persist subscriber details in db for prevent future registry lookup
        const subscriber = new OndcSubscriberInfo({
            subscriberId: subscriberId,
            uniqueKeyId: uniqueKeyId,
            details: JSON.stringify(provider),
        })
        if (subscriber.data !== undefined) {
            await saveInDb(subscriber.data);
            LOG.info(`saveInDb for ${subscriberId} ${uniqueKeyId}`);
        }
        return public_key;
    } catch (e) {
        LOG.info({msg: `registryLookup for ${subscriberId} ${uniqueKeyId} exception`, exception: e});
        return null;
    }
};

export const getSubscriberPublicKey = async (subscriberId: string, uniqueKeyId: string, subscriberType: string = SUBSCRIBER_TYPE.BAP) => {
    const fromDb = await fetchFromDb(subscriberId, uniqueKeyId);
    LOG.info({msg: `fetchFromDb ${subscriberId} ${uniqueKeyId}`, fromDb: JSON.stringify(fromDb)});
    if (fromDb === null) {
        return await registryLookup(subscriberId, uniqueKeyId, subscriberType);
    }
    LOG.info({msg: `subscriber ${subscriberId} ${uniqueKeyId} found in db`});
    if (fromDb.data !== undefined) {
        return new SubscriberItemInLookupResponse(JSON.parse(fromDb.data.details)).data?.signing_public_key || null;
    }
    return null;
}

