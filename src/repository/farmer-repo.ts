import {CONSTANTS} from '../CONSTANTS';
import {Farmer, IFarmer, ProviderToFarmer} from '../models/farmer';
import {DB} from '../common/lib/db';
import SqlString from 'sqlstring';

class FarmerRepo {
    private readonly table = CONSTANTS.tables.farmer;
    private readonly columns = 'farmerName, phone';
    private readonly update = `update ${this.table}`;
    private readonly insert = `insert into ${this.table}`;
    getProviderIdPhoneMap = async (providerIdFilter: string[]) => {
        return DB.all<ProviderToFarmer>(
            SqlString.format(
                `select f.providerId, fa.* from farm f join farmer fa on fa.id = f.farmerId and f.providerId in (?)`,
                [providerIdFilter]
            ),
            ProviderToFarmer
        );
    }
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
