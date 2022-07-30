import {CONSTANTS} from '../CONSTANTS';
import {
    FarmInventory,
    FarmInventoryLedger,
    IFarmInventory,
    IFarmInventoryLedger
} from '../models/farmer';
import {DB} from '../common/lib/db';
import SqlString from 'sqlstring';

class FarmInventoryRepo {
    private readonly table = CONSTANTS.tables.farmInventory;
    private readonly ledgerTable = CONSTANTS.tables.farmInventoryLedger;
    private readonly columns = 'farmId, priceInPaise, productId, qty, itemId';
    private readonly ledgerColumns = 'farmId, productId, qty, op, opening, createdAt, itemId';
    private readonly insert = `insert into ${this.table}`;
    private readonly insertLedger = `insert into ${this.ledgerTable}`;
    private readonly delete = `delete from ${this.table}`;

    // search
    searchByItemName = async (itemName: string) => {
        return DB.all<FarmInventory>(
            SqlString.format(
                `select * from farmInventory where productId in 
                    (SELECT id FROM productCatalog WHERE MATCH(productName, productDescription, variant) AGAINST(? IN NATURAL LANGUAGE MODE)) limit 100`,
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

    searchByPriceRange = async (startPriceInPaise: number, endPriceInPaise: number) => {
        return DB.all<FarmInventory>(
            SqlString.format(
                `select * from farmInventory where priceInPaise between ? and ? limit 100`,
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
        const {farmId, productId, qty: delta, op, opening, createdAt, itemId} = ledgerData
        const {priceInPaise, qty} = inventoryData;
        await DB.updateTxn([
            SqlString.format(
                this.delete + ` where productId = ? and farmId = ?`,
                [productId, farmId]
            ),
            SqlString.format(
                this.insert + ` (farmId, priceInPaise, productId, qty, itemId) values(?, ?, ?, ?)`,
                [farmId, priceInPaise, productId, qty, itemId]
            ),
            SqlString.format(
                this.insertLedger + ` (farmId, productId, qty, op, opening, createdAt, itemId) values(?, ?, ?, ?, ?, ?)`,
                [farmId, productId, delta, op, opening, createdAt, itemId]
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
