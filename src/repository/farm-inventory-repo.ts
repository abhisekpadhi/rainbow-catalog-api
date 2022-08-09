import {CONSTANTS} from '../CONSTANTS';
import {
    FarmInventory,
    FarmInventoryLedger,
    IFarmInventory,
    IFarmInventoryLedger
} from '../models/farmer';
import {DB} from '../common/lib/db';
import SqlString from 'sqlstring';
import _ from 'lodash';

class FarmInventoryRepo {
    private readonly table = CONSTANTS.tables.farmInventory;
    private readonly ledgerTable = CONSTANTS.tables.farmInventoryLedger;
    private readonly columns = 'farmId, priceInPaise, productId, qty, itemId';
    private readonly ledgerColumns = 'farmId, productId, qty, op, opening, createdAt, itemId';
    private readonly insert = `insert into ${this.table}`;
    private readonly insertLedger = `insert into ${this.ledgerTable}`;
    private readonly delete = `delete from ${this.table}`;

    // select
    getByMultipleItemIds = async (itemIds: string[]) => {
        return DB.all<FarmInventory>(
            SqlString.format(
                'select * from farmInventory where itemId in (?)',
                [itemIds]
            ),
            FarmInventory
        );
    }

    // search
    searchByItemName = async (itemName: string) => {
        return DB.all<FarmInventory>(
            SqlString.format(
                'select fi.* from farmInventory fi left join productCatalog pc on fi.productId = pc.skuId where match(pc.productName, pc.productDescription, pc.variant) against(? in natural language mode) limit 100',
                [itemName]
            ),
            FarmInventory
        )
    }

    searchByItemId = async (itemId: string) => {
        return DB.get<FarmInventory>(
            SqlString.format(
                `select * from ${this.table} where itemId = ?`,
                [itemId]
            ),
            FarmInventory
        );
    };

    searchByPriceRange = async (itemName: string, startPriceInPaise: number, endPriceInPaise: number) => {
        if (itemName.length > 0) {
            return DB.all<FarmInventory>(
                SqlString.format(
                    'select fi.* from farmInventory fi left join productCatalog pc on fi.productId = pc.skuId where match(pc.productName, pc.productDescription, pc.variant) against(? in natural language mode) and priceInPaise BETWEEN ? AND ? LIMIT 100',
                    [itemName, startPriceInPaise, endPriceInPaise]
                ),
                FarmInventory
            )
        }
        return DB.all<FarmInventory>(
            SqlString.format(
                `SELECT * FROM farmInventory WHERE priceInPaise BETWEEN ? AND ? LIMIT 100`,
                [startPriceInPaise, endPriceInPaise],
            ),
            FarmInventory
        );
    };

    // inventory ops
    getInventoryByFarm = async (farmId: number) => {
        return DB.all<FarmInventory>(
            SqlString.format(
                `select * from ${this.table} where farmId = ?`,
                [farmId]
            ),
            FarmInventory
        )
    }
    getInventorySku = async (farmId: number, skuId: string) => {
        return DB.get<FarmInventory>(
            SqlString.format(
                `select * from ${this.table} where farmId = ? and productId = ?`,
                [farmId, skuId]
            ),
            FarmInventory
        )
    }
    updateFarmInventory = async (ledgerData: IFarmInventoryLedger, inventoryData: IFarmInventory) => {
        const {farmId, productId} = ledgerData
        await DB.updateTxn([
            SqlString.format(
                this.delete + ` where productId = ? and farmId = ?`,
                [productId, farmId]
            ),
            SqlString.format(
                this.insert + ` set ?`,
                [_.omit(inventoryData, 'id')]
            ),
            SqlString.format(
                this.insertLedger + ` set ?`,
                [_.omit(ledgerData, 'id')]
            ),
        ]);
    }
    getLedger = async (farmId: number) => {
        return await DB.all<FarmInventoryLedger>(
            SqlString.format(
                `select * from ${this.ledgerTable} where farmId = ?`,
                [farmId]
            ),
            FarmInventoryLedger
        )
    }
}

export default new FarmInventoryRepo();
