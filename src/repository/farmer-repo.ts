import {CONSTANTS} from '../CONSTANTS';
import {Farmer, IFarmer} from '../models/farmer-account';
import {DB} from '../common/lib/db';
import SqlString from 'sqlstring';

class FarmerRepo {
    private readonly table = CONSTANTS.tables.farmer;
    private readonly columns = 'farmerName, phone';
    private readonly update = `update ${this.table}`;
    private readonly insert = `insert into ${this.table}`;
    getByPhone = async (phone: string) => {
        return DB.get<Farmer>(
            SqlString.format(
                `select * from ${this.table} where phone = ?`,
                [phone]
            ),
            Farmer
        )
    }
    updateFarmer = async (data: IFarmer) => {
        const {farmerName, phone} = data;
        await DB.update(
            SqlString.format(
                this.insert + ` (farmerName, phone) values(?, ?)`,
                [farmerName, phone]
            )
        );
    }
}

export default new FarmerRepo();
