import {z} from 'zod';
import {BaseDTO} from './baseDTO';

export const BaseSchema = z.object({
    id: z.number().default(0),
});

export const FarmSchema = BaseSchema.extend({
    farmerId: z.number().default(0),
    farmName: z.string().max(48).default(''),
    farmLocation: z.string().max(64).default('')
});

export type IFarm = z.infer<typeof FarmSchema>;

export class Farm extends BaseDTO<IFarm> {
    constructor(init: Partial<IFarm>) {
        super(FarmSchema.parse(init));
    }
}

export const FarmerSchema = BaseSchema.extend({
    phone: z.string().max(10).default(''),
    farmerName: z.string().max(48).default(''),
});

export type IFarmer = z.infer<typeof FarmerSchema>;

export class Farmer extends BaseDTO<IFarmer> {
    constructor(init: Partial<IFarmer>) {
        super(FarmerSchema.parse(init));
    }
}

export const FarmInventorySchema = BaseSchema.extend({
    farmId: z.number().default(0),
    priceInPaise: z.number().default(0),
    productId: z.number().default(0),
});

export type IFarmInventory = z.infer<typeof FarmInventorySchema>;

export class FarmInventory extends BaseDTO<IFarmInventory> {
    constructor(init: Partial<IFarmInventory>) {
        super(FarmInventorySchema.parse(init));
    }
}


export const FarmInventoryLedgerSchema = BaseSchema.extend({
    farmId: z.number().default(0),
    productId: z.number().default(0),
    qty: z.number().default(0),
    op: z.enum(['add', 'remove']).default('add'),
    opening: z.number().default(0),
    createdAt: z.number().default(0),
});

export type IFarmInventoryLedger = z.infer<typeof FarmInventoryLedgerSchema>;

export class FarmInventoryLedger extends BaseDTO<IFarmInventoryLedger> {
    constructor(init: Partial<IFarmInventoryLedger>) {
        super(FarmInventoryLedgerSchema.parse(init));
    }
}

export const FarmPrefsSchema = BaseSchema.extend({
    farmId: z.number().default(0),
    prefKey: z.string().max(48).default(''),
    prefValue: z.string().max(256).default(''),
});

export type IFarmPrefs = z.infer<typeof FarmPrefsSchema>;

export class FarmPrefs extends BaseDTO<IFarmPrefs> {
    constructor(init: Partial<IFarmPrefs>) {
        super(FarmPrefsSchema.parse(init));
    }
}

export const ProductCatalogSchema = BaseSchema.extend({
    productName: z.string().max(48).default(''),
    packSize: z.string().max(32).default(''),
    productDescription: z.string().max(256).default(''),
    imageUrl: z.string().max(1024).default(''),
    grading: z.string().max(256).default(''),
    variant: z.string().max(256).default(''),
    perishability: z.string().max(32).default(''),
    logisticsNeed: z.string().max(32).default(''),
    coldChain: z.string().max(32).default(''),
    idealDelTat: z.string().max(32).default(''),
    skuId: z.string().max(36).default(''),
});

export type IProductCatalog = z.infer<typeof ProductCatalogSchema>;

export class ProductCatalog extends BaseDTO<IProductCatalog> {
    constructor(init: Partial<IProductCatalog>) {
        super(ProductCatalogSchema.parse(init));
    }
}

