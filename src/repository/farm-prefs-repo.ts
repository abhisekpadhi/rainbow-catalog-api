import {CONSTANTS} from '../CONSTANTS';
import {FarmPrefs, IFarmPrefs} from '../models/farmer-account';
import {DB} from '../common/lib/db';
import SqlString from 'sqlstring';

class FarmPrefsRepo {
    private readonly table = CONSTANTS.tables.farmPrefs;
    private readonly columns = 'farmId, prefKey, prefValue';
    private readonly update = `update ${this.table}`;
    private readonly delete = `delete from ${this.table}`;
    private readonly insert = `insert into ${this.table}`;
    getByFarmId = async (farmId: number) => {
        return DB.all<FarmPrefs>(
            SqlString.format(
                `select * from ${this.table} where id = ?`,
                [farmId]
            ),
            FarmPrefs
        )
    }
    updateFarmPrefs = async (data: IFarmPrefs) => {
        const {farmId, prefKey, prefValue} = data;
        await DB.updateTxn([
            SqlString.format(
                this.delete + ` where farmId = ? and prefKey = ?`,
                [farmId, prefKey]
            ),
            SqlString.format(
                this.insert + ` (farmId, prefKey, prefValue) values(?, ?, ?)`,
                [farmId, prefKey, prefValue]
            )
        ]);
    }
}

export default new FarmPrefsRepo();
