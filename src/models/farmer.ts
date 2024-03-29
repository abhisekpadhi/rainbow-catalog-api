import {z} from 'zod';
import {BaseDTO} from './baseDTO';
import {entityIdSchema, numberSchema} from './common';
import dayjs from 'dayjs';

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
    rating: z.number().max(5).default(0),
    extraData: z.string().default(''),
});

export interface IFarmExtraData {
    rating: {
        total: number;
        count: number;
    }
}


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

export const FarmerLoginSchema = BaseSchema.extend({
    farmer: FarmerSchema,
    otp: z.string().max(4).default(''),
})

export type IFarmerLoginRequest = z.infer<typeof FarmerLoginSchema>;

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

export const opSchema = z.enum(['add', 'remove', 'price']).default('add');

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

export interface IFarmInventoryLedgerResp extends IFarmInventoryLedger {
    product: IProductCatalog;
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
    itemId: string;
    qty: number;
    priceInPaise: number;
}

export const InventoryUpdateRequestSchema = FarmInventorySchema.extend({ op: opSchema });
export type IInventoryUpdateRequest = z.infer<typeof InventoryUpdateRequestSchema>;

export const InventoryPricingUpdateRequestSchema = z.object({
    itemId: entityIdSchema,
    priceInPaise: z.number().default(0),
});

export type IInventoryPricingUpdateRequest = z.infer<typeof InventoryPricingUpdateRequestSchema>;

export const RatingSchema = BaseSchema.extend({
    ctxTxnId: z.string().default(''),
    payload: z.string().default(''),
});

export type IRating = z.infer<typeof RatingSchema>;

export class Rating extends BaseDTO<IRating> {
    constructor(payload: Partial<IRating>) {
        super(RatingSchema.parse(payload));
    }
}

/**
 * - Created
 *             - Packed
 *             - Shipped
 *             - Out for Delivery
 *             - Delivered
 *             - RTO initiated
 *             - RTO delivered
 *             - Cancelled
 */
export enum OrderStatus {
    active = 'Active',
    created = 'Created',
    rts='Packed',
    shipped='Shipped',
    ofd='Out for Delivery',
    delivered = 'Delivered',
    cancelled = 'Cancelled',
    rtoi = 'RTO initiated',
    rtod = 'RTO delivered',
}

export enum OrderRefundTerms {
    refundAllowed = 'refund-allowed',
    refundNotAllowed = 'refund-not-allowed',
}

export const BuyerOrderScheme = BaseSchema.extend({
    orderId: entityIdSchema,
    customerId: entityIdSchema.default(''),
    ctxTxnId: z.string().max(256).default(''),
    createdAt: numberSchema.default(dayjs().valueOf()),
    orderStatus: z.nativeEnum(OrderStatus).default(OrderStatus.active),
    refundTerms: z.nativeEnum(OrderRefundTerms).default(OrderRefundTerms.refundNotAllowed),
    ff: z.string().default(''),
    billing: z.string().default(''),
    quote: z.string().default(''),
    items: z.string().default(''),
    extraData: z.string().default(''),
    cancellation: z.string().default(''),
});

export type IBuyerOrder = z.infer<typeof BuyerOrderScheme>;

export class BuyerOrder extends BaseDTO<IBuyerOrder> {
    constructor(payload: Partial<IBuyerOrder>) {
        super(BuyerOrderScheme.parse(payload));
    }
}

export type OrderCancelledBy = 'buyer-app' | 'seller-app' | 'logistics-provider';
export interface BuyerOrderExtraData {
    cancelledBy?: OrderCancelledBy,
    cancelReason?: string;
}

export const SellerOrderSchema = BaseSchema.extend({
    sellerOrderId: entityIdSchema,
    sellerProviderId: entityIdSchema,
    buyerOrderId: entityIdSchema,
    items: z.string().default(''),
    quote: z.string().default(''),
    orderStatus: z.nativeEnum(OrderStatus).default(OrderStatus.created),
    createdAt: z.number().default(dayjs().valueOf()),
    extraData: z.string().default(''),
});

export type ISellerOrder = z.infer<typeof SellerOrderSchema>;

export class SellerOrder extends BaseDTO<ISellerOrder> {
    constructor(payload: Partial<ISellerOrder>) {
        super(SellerOrderSchema.parse(payload));
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

export interface ISellerOrderResponse {
    sellerOrderId: string;
    createdAt: number;
    status: string;
    deliveryAddress: string;
    customer: string;
    customerNote: string;
    itemList: {itemName: string, qty: number, picUrl: string}[];
}

export const SellerOrderStatusUpdateRequestSchema = BaseSchema.extend({
    orderId: entityIdSchema.removeDefault(),
    status: z.nativeEnum(OrderStatus),
});

export type ISellerOrderStatusUpdateRequestSchema = z.infer<typeof SellerOrderStatusUpdateRequestSchema>;

export const OndcContextSchema = BaseSchema.extend({
    ctxTxnId: z.string().max(255).default(''),
    ctx: z.string().default(''),
    createdAt: z.number().default(dayjs().valueOf())
});

export type IOndcContext = z.infer<typeof OndcContextSchema>;

export class OndcContext extends BaseDTO<IOndcContext> {
    constructor(payload: Partial<IOndcContext>) {
        super(OndcContextSchema.parse(payload));
    }
}

export interface IProviderToFarmerMapping extends IFarmer {
    providerId: string;
}

export class ProviderToFarmer extends BaseDTO<IProviderToFarmerMapping> {
    constructor(payload: IProviderToFarmerMapping) {
        super(payload);
    }
}
