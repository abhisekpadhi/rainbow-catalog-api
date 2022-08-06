import {bapCallback} from '../callback';
import {LOG} from '../../common/lib/logger';
import {PROTOCOL_CONTEXT} from '../models';
import ratingRepo from '../../repository/rating-repo';
import {Farm, IFarmExtraData, BuyerOrderExtraData, Rating} from '../../models/farmer';
import farmRepo from '../../repository/farm-repo';

const getType = (payload: any) => {
    if (payload?.message?.rating_category !== undefined) {
        return payload.message.rating_category // can be comma separated values: add-ons, payment, billing, fulfillment, items
    }
    return '';
};

export const ratingHandler = async (payload: any) => {
    const type = getType(payload);
    if (type.length === 0) {
        return;
    }
    LOG.info({msg: `ratingCategory: ${type}`});
    const result = await handleAckRating(payload);
    const body = {
        context: payload.context,
        message: result
    };
    LOG.info({msg: 'init handler response', body});
    await bapCallback(PROTOCOL_CONTEXT.ON_RATING, body);
}

const _makeEmptyResponse = () => {
    return {
        "feedback_ack": false,
        "rating_ack": false
    }
}

// for hackathon we are ignoring all ratings
const handleAckRating = async (payload: any) => {
    const ctxTxnId = payload?.context?.transaction_id || '';
    if (ctxTxnId.length === 0) {
        return _makeEmptyResponse();
    }
    // save rating in db
    await ratingRepo.addRating(new Rating({ctxTxnId, payload: JSON.stringify(payload?.message)}).data!);
    const ratingCategory = payload?.message?.rating_category || '';
    const ratingValue = payload?.message?.value || 1;

    // update provider rating in db
    if (ratingCategory === 'provider') {
        const providerId = payload?.message?.id || '';
        if (providerId.length > 0) {
            const farm = await farmRepo.getByProviderId(providerId);
            if (farm !== null) {
                const extraData: IFarmExtraData = {
                    rating: {
                        total: (farm.data?.extraData || '').length > 0 ? (JSON.parse(farm.data!.extraData)?.rating?.total || 0) + ratingValue : ratingValue,
                        count: (farm.data?.extraData || '').length > 0 ? (JSON.parse(farm.data!.extraData)?.rating?.count || 0) + 1 : 1,
                    }
                }
                const rating = extraData.rating.total/extraData.rating.count;
                LOG.info({providerId, rating});
                await farmRepo.updateFarm(new Farm({...farm.data!, rating, extraData: JSON.stringify(extraData)}).data!);
            }
        }
    }
    return {
        "feedback_ack": true,
        "rating_ack": true
    }
}
