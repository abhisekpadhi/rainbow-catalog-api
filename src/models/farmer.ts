import {z} from 'zod';
import {BaseDTO} from './baseDTO';
import {entityIdSchema, numberSchema, orderStatusSchema, refundSchema} from './common';

export const BaseSchema = z.object({
    id: numberSchema,
});

export const FarmSchema = BaseSchema.extend({
    farmerId: numberSchema,
    farmName: z.string().max(48).default(''),
    farmLocation: z.string().max(64).default(''),
    providerId: entityIdSchema,
    supportPhone: z.string().max(10).default(''),
    supportEmail: z.string().max(255).default(''),
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
    rating: z.number().max(5).default(0),
});

export type IFarmer = z.infer<typeof FarmerSchema>;

export class Farmer extends BaseDTO<IFarmer> {
    constructor(init: Partial<IFarmer>) {
        super(FarmerSchema.parse(init));
    }
}

export const FarmInventorySchema = BaseSchema.extend({
    farmId: numberSchema,
    priceInPaise: numberSchema,
    productId: z.string().max(36).default(''),
    qty: numberSchema,
    itemId: entityIdSchema,
});

export type IFarmInventory = z.infer<typeof FarmInventorySchema>;

export class FarmInventory extends BaseDTO<IFarmInventory> {
    constructor(init: Partial<IFarmInventory>) {
        super(FarmInventorySchema.parse(init));
    }
}

export const opSchema = z.enum(['add', 'remove']).default('add');

export const FarmInventoryLedgerSchema = BaseSchema.extend({
    farmId: numberSchema,
    productId: z.string().default(''),
    qty: numberSchema,
    op: opSchema,
    opening: numberSchema,
    createdAt: numberSchema,
    itemId: entityIdSchema,
});

export type IFarmInventoryLedger = z.infer<typeof FarmInventoryLedgerSchema>;

export class FarmInventoryLedger extends BaseDTO<IFarmInventoryLedger> {
    constructor(init: Partial<IFarmInventoryLedger>) {
        super(FarmInventoryLedgerSchema.parse(init));
    }
}

export const FarmPrefsSchema = BaseSchema.extend({
    farmId: numberSchema,
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


export interface IInventoryResponse extends IProductCatalog {
    qty: number;
}

export const InventoryUpdateRequestSchema = FarmInventorySchema.extend({ op: opSchema });
export type IInventoryUpdateRequest = z.infer<typeof InventoryUpdateRequestSchema>;

export const FarmerRatingSchema = BaseSchema.extend({
    customerId: entityIdSchema,
    farmerId: entityIdSchema,
    rating: numberSchema,
    extraData: z.string().default(''),
    createdAt: numberSchema,
});

export type IFarmerRating = z.infer<typeof FarmerRatingSchema>;

export const OrderSchema = BaseSchema.extend({
    orderId: entityIdSchema,
    customerId: entityIdSchema,
    ctxTxnId: entityIdSchema,
    createdAt: numberSchema,
    orderStatus: orderStatusSchema,
    refundTerms: refundSchema,
    ff: z.string().default(''),
    billing: z.string().default(''),
    quote: z.string().default(''),
    items: z.string().default(''),
});

export type IOrder = z.infer<typeof OrderSchema>;

export class Order extends BaseDTO<IOrder> {
    constructor(payload: Partial<IOrder>) {
        super(OrderSchema.parse(payload));
    }
}

export const OrderPaymentSchema = BaseSchema.extend({
    orderId: entityIdSchema,
    txnId: entityIdSchema,
    type: z.string().max(45).default(''),
    amountInPaise: numberSchema,
    orderPaymentStatus: z.string().max(45).default(''),
    createdAt: numberSchema,
});

export type IOrderPayment = z.infer<typeof OrderPaymentSchema>;

export class OrderPayment extends BaseDTO<IOrderPayment> {
    constructor(payload: Partial<IOrderPayment>) {
        super(OrderPaymentSchema.parse(payload));
    }
}
