import {z} from 'zod';

export interface IApiResponse {
    body: string;
    statusCode: number;
}


export const entityIdSchema = z.string().max(45).default('');
export const numberSchema = z.number().default(0);
export const phoneSchema = z.string().max(10);
export const orderStatusSchema = z.enum(['active', 'in-transit', 'delivered', 'cancelled', 'rto']);
export const refundSchema = z.enum(['refund-allowed','refund-not-allowed']);

