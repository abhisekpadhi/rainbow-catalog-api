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

    getOrdersOfFarmerByStatus = (sellerProviderId: string, status: string[]) => {
        return DB.all<SellerOrder>(
            SqlString.format(
                'select * from ?? where sellerProviderId = ? and orderStatus in (?)',
                [this.table, sellerProviderId, status]
            ),
            SellerOrder
        );
    }

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
                `select * from ${this.table} where sellerOrderId = ?`,
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
                this.update + ` set ? where sellerOrderId = ?`,
                [_.omit(data, 'id'), data.sellerOrderId]
            ),
        ]);
    }

    updateStatus = async (orderId: string, status: string) => {
        await  DB.updateTxn([
            SqlString.format(
                this.update +  ' SET orderStatus = ? WHERE sellerOrderId = ?',
                [status, orderId]
            )
        ]);
    }
}

export default new SellerOrderRepo();
