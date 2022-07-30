import {CONSTANTS} from '../CONSTANTS';
import {
    IOrder, Order
} from '../models/farmer';
import {DB} from '../common/lib/db';
import SqlString from 'sqlstring';

class OrderRepo {
    private readonly table = CONSTANTS.tables.order;
    private readonly columns = "orderId, customerId, ctxTxnId, createdAt, orderStatus, refundTerms, ff, billing, quote, items";
    private readonly insert = `insert into ${this.table}`;
    private readonly update = `update ${this.table}`;

    getOrderByCtxTxnId = async (ctxTxnId: string) => {
        return DB.get<Order>(
            SqlString.format(
                `select * from ${this.table} where orderId = ?`,
                [ctxTxnId]
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
        const {orderId, customerId, ctxTxnId, createdAt, orderStatus, refundTerms, ff, billing, quote, items} = data
        await DB.updateTxn([
            SqlString.format(
                this.insert + ` (??) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [orderId, customerId, ctxTxnId, createdAt, orderStatus, refundTerms, ff, billing, quote, items]
            ),
        ]);
    }

    updateOrder = async (data: IOrder) => {
        const {orderId, customerId, ctxTxnId, createdAt, orderStatus, refundTerms, ff, billing, quote, items} = data
        await DB.updateTxn([
            SqlString.format(
                this.update + ` set orderId = ?, customerId = ?, ctxTxnId = ?, createdAt = ?, orderStatus = ?, refundTerms = ?, ff = ?, billing = ?, quote = ?, items = ?`,
                [orderId, customerId, ctxTxnId, createdAt, orderStatus, refundTerms, ff, billing, quote, items]
            ),
        ]);
    }
}

export default new OrderRepo();
