import {CONSTANTS} from '../CONSTANTS';
import {IOndcContext, OndcContext} from '../models/farmer';
import {DB} from '../common/lib/db';
import SqlString from 'sqlstring';

class OndcContextRepo {
    private readonly table = CONSTANTS.tables.ondcContext;
    private readonly columns = 'ctxTxnId, ctx, createdAt';
    private readonly update = `UPDATE ${this.table}`;
    private readonly delete = `DELETE FROM ${this.table}`;
    private readonly insert = `INSERT INTO ${this.table}`;
    getCtx = async (txnId: string) => {
        return DB.get<OndcContext>(
            SqlString.format(
                'SELECT * FROM ?? where ctxTxnId = ?',
                [this.table, txnId]
            ),
            OndcContext
        );
    }
    addCtx = async (data: IOndcContext) => {
        return DB.updateTxn([
            SqlString.format(
                this.insert + ' SET ?',
                [data]
            )
        ]);
    }
}

export default new OndcContextRepo();
