import {CONSTANTS} from '../CONSTANTS';
import {
    SellerOrder, ISellerOrder
} from '../models/farmer';
import {DB} from '../common/lib/db';
import SqlString from 'sqlstring';
import _ from 'lodash';

class SellerOrderRepo {
    private readonly table = CONSTANTS.tables.sellerOrder;
    private readonly columns = "sellerProviderId, buyerProviderId, items, quote, orderStatus, createdAt, extraData";
    private readonly insert = `INSERT INTO ${this.table} `;
    private readonly update = `UPDATE ${this.table} `;

    getByBuyerOrderId = async (buyerOrderId: string) => {
        return DB.all<SellerOrder>(
            SqlString.format(
                'select * from ?? where buyerOrderId = ?',
                [this.table, buyerOrderId]
            ),
            SellerOrder
        );
    }

    getOrderSellerOrderId = async (orderId: string) => {
        return DB.get<SellerOrder>(
            SqlString.format(
                `select * from ${this.table} where orderId = ?`,
                [orderId]
            ),
            SellerOrder
        );
    }

    insertOrder = async (data: ISellerOrder) => {
        // const {orderId, customerId, ctxTxnId, createdAt, orderStatus, refundTerms, ff, billing, quote, items, extraData} = data
        await DB.updateTxn([
            SqlString.format(
                this.insert + 'set ?',
                [_.omit(data, 'id')]
            ),
        ]);
    }

    updateOrder = async (data: ISellerOrder) => {
        await DB.updateTxn([
            SqlString.format(
                this.update + ` set ?`,
                [_.omit(data, 'id')]
            ),
        ]);
    }
}

export default new SellerOrderRepo();
