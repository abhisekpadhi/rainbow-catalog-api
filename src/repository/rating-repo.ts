import {CONSTANTS} from '../CONSTANTS';
import {IRating} from '../models/farmer';
import {DB} from '../common/lib/db';
import SqlString from 'sqlstring';

class RatingRepo {
    private readonly table = CONSTANTS.tables.rating;
    private readonly insert = `DELETE INTO ${this.table}`;
    addRating = async (data: IRating) => {
        await DB.updateTxn([
            SqlString.format(
                this.insert + ` SET ?`,
                [data]
            )
        ]);
    }
}

export default new RatingRepo();
