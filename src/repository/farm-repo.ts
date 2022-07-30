import {CONSTANTS} from '../CONSTANTS';
import {Farm, IFarm} from '../models/farmer';
import {DB} from '../common/lib/db';
import SqlString from 'sqlstring';

class FarmRepo {
    private readonly table = CONSTANTS.tables.farm;
    private readonly columns = 'farmerId, farmName, farmLocation, providerId, supportPhone, supportEmail, rating';
    private readonly update = `update ${this.table}`;
    private readonly insert = `insert into ${this.table}`;
    searchByStoreName = async (storeName: string) => {
        return DB.all<Farm>(
            SqlString.format(
                `select * FROM farm WHERE MATCH(farmName) AGAINST(? IN NATURAL LANGUAGE MODE) limit 100`,
                [storeName]
            ),
            Farm
        );
    }
    searchByRating = async (rating: number) => {
        return DB.all<Farm>(
            SqlString.format(
                `select * from farm where rating >= ? limit 100`,
                [rating]
            ),
            Farm
        );
    }
    getAll = async () => {
        return DB.all<Farm>(`select * from farm`, Farm);
    }
    getByProviderId = async (farmId: string) => {
        return DB.get<Farm>(
            SqlString.format(
                `select * from ${this.table} where providerId = ?`,
                [farmId]
            ),
            Farm
        )
    }
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
