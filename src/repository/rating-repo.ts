import {CONSTANTS} from '../CONSTANTS';
import {FarmPrefs, IFarmPrefs, IRating} from '../models/farmer';
import {DB} from '../common/lib/db';
import SqlString from 'sqlstring';

class RatingRepo {
    private readonly table = CONSTANTS.tables.rating;
    private readonly columns = 'ctxTxnId, payload'.split(', ');
    private readonly update = `update ${this.table}`;
    private readonly delete = `delete from ${this.table}`;
    private readonly insert = `insert into ${this.table}`;
    addRating = async (data: IRating) => {
        const {ctxTxnId, payload} = data;
        await DB.updateTxn([
            SqlString.format(
                this.insert + ` (??) values(?, ?)`,
                [this.columns, ctxTxnId, payload]
            )
        ]);
    }
}

export default new RatingRepo();
