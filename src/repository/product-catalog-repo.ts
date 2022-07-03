import {CONSTANTS} from '../CONSTANTS';
import {Farm, IFarm, IProductCatalog, ProductCatalog} from '../models/farmer-account';
import {DB} from '../common/lib/db';
import SqlString from 'sqlstring';

class ProductCatalogRepo {
    private readonly table = CONSTANTS.tables.productCatalog;
    private readonly columns = 'productName, packSize, productDescription, imageUrl, grading, variant, perishability, logisticsNeed, coldChain, idealDelTat, skuId';
    private readonly update = `update ${this.table}`;
    private readonly delete = `delete from ${this.table}`;
    private readonly insert = `insert into ${this.table}`;
    getByProductId = async (productId: string) => {
        return DB.get<ProductCatalog>(
            SqlString.format(
                `select * from ${this.table} where skuId = ?`,
                [productId]
            ),
            ProductCatalog
        )
    }
    updateProduct = async (data: IProductCatalog) => {
        const {productName, packSize, productDescription, imageUrl, grading, variant, perishability, logisticsNeed, coldChain, idealDelTat, skuId} = data;
        await DB.updateTxn([
            SqlString.format(
                this.delete + ` where skuId = ?`,
                [skuId]
            ),
            SqlString.format(
                this.insert + ` (productName, packSize, productDescription, imageUrl, grading, variant, perishability, logisticsNeed, coldChain, idealDelTat, skuId) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [productName, packSize, productDescription, imageUrl, grading, variant, perishability, logisticsNeed, coldChain, idealDelTat, skuId]
            )
        ]);
    }
}

export default new ProductCatalogRepo();
