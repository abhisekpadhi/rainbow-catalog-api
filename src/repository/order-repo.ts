import {CONSTANTS} from '../CONSTANTS';
import {
    IBuyerOrder, BuyerOrder
} from '../models/farmer';
import {DB} from '../common/lib/db';
import SqlString from 'sqlstring';
import _ from 'lodash';

class OrderRepo {
    private readonly table = CONSTANTS.tables.order;
    private readonly columns = "orderId, customerId, ctxTxnId, createdAt, orderStatus, refundTerms, ff, billing, quote, items, extraData, cancellation";
    private readonly insert = `INSERT INTO ${this.table} `;
    private readonly update = `UPDATE ${this.table} `;

    getOrderByCtxTxnId = async (ctxTxnId: string) => {
        return DB.get<BuyerOrder>(
            SqlString.format(
                'select * from ?? where ctxTxnId = ?',
                [this.table, ctxTxnId]
            ),
            BuyerOrder
        );
    }

    getOrderById = async (orderId: string) => {
        return DB.get<BuyerOrder>(
            SqlString.format(
                `select * from ${this.table} where orderId = ?`,
                [orderId]
            ),
            BuyerOrder
        );
    }

    insertOrder = async (data: IBuyerOrder) => {
        // const {orderId, customerId, ctxTxnId, createdAt, orderStatus, refundTerms, ff, billing, quote, items, extraData} = data
        await DB.updateTxn([
            SqlString.format(
                this.insert + 'set ?',
                [_.omit(data, 'id')]
            ),
        ]);
    }

    updateOrder = async (data: IBuyerOrder) => {
        await DB.updateTxn([
            SqlString.format(
                this.update + ` set ?`,
                [_.omit(data, 'id')]
            ),
        ]);
    }
}

export default new OrderRepo();
