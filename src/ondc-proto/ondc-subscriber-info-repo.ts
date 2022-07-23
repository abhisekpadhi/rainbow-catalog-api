import {CONSTANTS} from '../CONSTANTS';
import {DB} from '../common/lib/db';
import SqlString from 'sqlstring';
import {IOndcSubscriberInfo, OndcSubscriberInfo} from '../models/ondc-bridge';
import {LOG} from '../common/lib/logger';

class OndcSubscriberInfoRepo {
    private readonly table = CONSTANTS.tables.ondcSubscriberInfo;
    private readonly columns = 'subscriberId, uniqueKeyId, details, currentActive, createdAt';
    private readonly insert = `insert into ${this.table}`;
    private readonly update = `update ${this.table}`;
    getSubscriber = async (subscriberId: string, uniqueKeyId: string) => {
        LOG.info({msg: `getSubscriber called on repo ${subscriberId} ${uniqueKeyId}`});
        return DB.get<OndcSubscriberInfo>(
            SqlString.format(
                `select * from ${this.table} where subscriberId = ? and uniqueKeyId = ?`,
                [subscriberId, uniqueKeyId]
            ),
            OndcSubscriberInfo
        )
    }
    updateSubscriber = async (data: IOndcSubscriberInfo) => {
        const {subscriberId, uniqueKeyId, details, currentActive, createdAt} = data;
        await DB.updateTxn([
            SqlString.format(
                this.update + ` set currentActive = 0 where subscriberId = ? and uniqueKeyId = ?`,
                [subscriberId, uniqueKeyId]
            ),
            SqlString.format(
                this.insert + ` (subscriberId, uniqueKeyId, details, currentActive, createdAt) values(?, ?, ?, ?, ?)`,
                [subscriberId, uniqueKeyId, details, currentActive, createdAt]
            ),
        ]);
    }
}

export default new OndcSubscriberInfoRepo();
