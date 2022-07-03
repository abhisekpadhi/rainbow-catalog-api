import {CONSTANTS} from '../CONSTANTS';
import {Farm, Farmer, IFarm, IFarmer} from '../models/farmer-account';
import {DB} from '../common/lib/db';
import SqlString from 'sqlstring';

class FarmRepo {
    private readonly table = CONSTANTS.tables.farm;
    private readonly columns = 'farmerId, farmName, farmLocation';
    private readonly update = `update ${this.table}`;
    private readonly insert = `insert into ${this.table}`;
    getByFarmId = async (farmId: number) => {
        return DB.get<Farm>(
            SqlString.format(
                `select * from ${this.table} where id = ?`,
                [farmId]
            ),
            Farm
        )
    }
    getByFarmerId = async (farmerId: number) => {
        return DB.all<Farm>(
            SqlString.format(
                `select * from ${this.table} where farmerId = ?`,
                [farmerId]
            ),
            Farm
        )
    }
    updateFarm = async (data: IFarm) => {
        const {farmerId, farmName, farmLocation} = data;
        await DB.update(
            SqlString.format(
                this.insert + ` (farmerId, farmName, farmLocation) values(?, ?, ?)`,
                [farmerId, farmName, farmLocation]
            )
        );
    }
}

export default new FarmRepo();
