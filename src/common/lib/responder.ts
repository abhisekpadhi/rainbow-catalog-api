import {Request, Response} from 'express';
import {ZodError, ZodObject} from 'zod';

// Important: handler function must accept the type as inferred by the schema
const post = async (req: Request, res: Response, schema: ZodObject<any>, handlerFn: Function) => {
    let data = null
    let errors = null
    try {
        data = await handlerFn(schema.parse(req.body));
    } catch (e) {
        if (e instanceof ZodError) {
            errors = e.flatten();
        } else {
            errors = 'server error'
        }
    }
    res.send({data, errors})
}

const get = async (req: Request, res: Response, handlerFn: Function) => {
    let data = null
    let errors = null
    try {
        data = await handlerFn(req.query);
    } catch (e) {
        errors = 'server error'
    }
    res.send({data, errors})
}

export const Responder = { ofPost: post, ofGet: get }
