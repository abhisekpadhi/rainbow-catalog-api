import {CONSTANTS} from '../CONSTANTS';
import {
    IOrder, Order
} from '../models/farmer';
import {DB} from '../common/lib/db';
import SqlString from 'sqlstring';
import _ from 'lodash';

class OrderRepo {
    private readonly table = CONSTANTS.tables.order;
    private readonly columns = "orderId, customerId, ctxTxnId, createdAt, orderStatus, refundTerms, ff, billing, quote, items, extraData";
    private readonly insert = `INSERT INTO ${this.table} `;
    private readonly update = `UPDATE ${this.table} `;

    getOrderByCtxTxnId = async (ctxTxnId: string) => {
        return DB.get<Order>(
            SqlString.format(
                'select * from ?? where ctxTxnId = ?',
                [this.table, ctxTxnId]
            ),
            Order
        );
    }

    getOrderById = async (orderId: string) => {
        return DB.get<Order>(
            SqlString.format(
                `select * from ${this.table} where orderId = ?`,
                [orderId]
            ),
            Order
        );
    }

    insertOrder = async (data: IOrder) => {
        // const {orderId, customerId, ctxTxnId, createdAt, orderStatus, refundTerms, ff, billing, quote, items, extraData} = data
        await DB.updateTxn([
            SqlString.format(
                this.insert + 'set ?',
                [_.omit(data, 'id')]
            ),
        ]);
    }

    updateOrder = async (data: IOrder) => {
        const {orderId, customerId, ctxTxnId, createdAt, orderStatus, refundTerms, ff, billing, quote, items, extraData} = data
        await DB.updateTxn([
            SqlString.format(
                this.update + ` set orderId = ?, customerId = ?, ctxTxnId = ?, createdAt = ?, orderStatus = ?, refundTerms = ?, ff = ?, billing = ?, quote = ?, items = ?, extraData = ?`,
                [orderId, customerId, ctxTxnId, createdAt, orderStatus, refundTerms, ff, billing, quote, items, extraData]
            ),
        ]);
    }
}

export default new OrderRepo();
