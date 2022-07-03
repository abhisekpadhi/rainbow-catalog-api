import {CONSTANTS} from '../CONSTANTS';
import {
    Farm,
    Farmer,
    FarmInventory, FarmInventoryLedger,
    IFarm,
    IFarmer,
    IFarmInventory,
    IFarmInventoryLedger
} from '../models/farmer-account';
import {DB} from '../common/lib/db';
import SqlString from 'sqlstring';

class FarmInventoryRepo {
    private readonly table = CONSTANTS.tables.farmInventory;
    private readonly ledgerTable = CONSTANTS.tables.farmInventoryLedger;
     private readonly columns = 'farmId, priceInPaise, productId, qty';
    private readonly ledgerColumns = 'farmId, productId, qty, op, opening, createdAt';
    private readonly insert = `insert into ${this.table}`;
    private readonly insertLedger = `insert into ${this.ledgerTable}`;
    private readonly delete = `delete from ${this.table}`;
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
        const {farmId, productId, qty: delta, op, opening, createdAt} = ledgerData
        const {priceInPaise, qty} = inventoryData;
        await DB.updateTxn([
            SqlString.format(
                this.delete + ` where productId = ? and farmId = ?`,
                [productId, farmId]
            ),
            SqlString.format(
                this.insert + ` (farmId, priceInPaise, productId, qty) values(?, ?, ?, ?)`,
                [farmId, priceInPaise, productId, qty]
            ),
            SqlString.format(
                this.insertLedger + ` (farmId, productId, qty, op, opening, createdAt) values(?, ?, ?, ?, ?, ?)`,
                [farmId, productId, delta, op, opening, createdAt]
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
