import mysql from 'mysql';
import {CONSTANTS} from '../../CONSTANTS';
import util from 'util';
import {z} from 'zod';
import {LOG} from './logger';

const pool = mysql.createPool(CONSTANTS.db);
const getConn = util.promisify(pool.getConnection).bind(pool);
const query = util.promisify(pool.query).bind(pool);

pool.on('acquire', function (connection) {
    LOG.info('Connection %d acquired', connection.threadId);
});

pool.on('release', function (connection) {
    LOG.info('Connection %d released', connection.threadId);
});

/**
 * Getting & releasing connection is automatic.
 * This function only work is execute statements and coerce type on result.
 * @param stmt: sql statement
 * @param queryFn: Query function
 */
const run = async <T>(stmt: string, queryFn?: (stmt: string) => Promise<unknown>): Promise<T> => {
    let q = queryFn;
    if (!queryFn) {
        q = query;
    }
    return await q!(stmt) as Promise<T>;
}

/**
 * Query wrapper boilerplate for SELECT queries expecting 1 record in response
 * @param stmt: sql statement
 * @param klass: class to which response will be casted to
 */
const get = async <K>(stmt: string, klass: any): Promise<K | null> => {
    type T = z.infer<typeof klass.schema>;
    try {
        const r = await run<T[]>(stmt)
        if (r.length > 0) {
            // instantiate object of class K
            if ('currentActive' in r[0]) {
                return new klass({
                    ...r[0],
                    currentActive: Boolean(Buffer.from(r[0].currentActive).readUInt8()).valueOf()
                }) as K;
            } else {
                return new klass(r[0]) as K;
            }
        }
    } catch (e) {
        LOG.info({error: e});
    }
    return null
}

/**
 * query wrapper boilerplate for SELECT queries expecting multiple records in response
 * @param stmt: sql statement
 * @param klass: class to which response will be casted to
 */
const all = async <K>(stmt: string, klass: any): Promise<K[] | null> => {
    type T = z.infer<typeof klass.schema>;
    try {
        const r = await run<T[]>(stmt)
        if (r.length > 0) {
            // instantiate object of class K
            return r.map(o => {
                if ('currentActive' in o) {
                    return new klass({
                        ...o,
                        currentActive: Boolean(Buffer.from(o.currentActive).readUInt8()).valueOf()
                    }) as K
                } else {
                    return new klass(o) as K;
                }
            })
        }
    } catch (e) {
        LOG.info({error: e});
    }
    return null
}

/**
 * query wrapper boilerplate for UPDATE/INSERT queries expecting nothing in response
 * @param stmt: sql statement
 */
const update = async (stmt: string) => {
    try {
        await run(stmt)
    } catch (e) {
        LOG.info({error: e});
    }
    return null
}

/**
 * Handle sequential INSERT/UPDATE statements in a transaction
 * @param stmts: list of mysql statements
 */
const updateTxn = async (stmts: string[]) => {
    let done = false;
    const conn = await getConn();
    const beginTxn = util.promisify(conn.beginTransaction).bind(conn);
    const rollback = util.promisify(conn.rollback).bind(conn);
    const commit = util.promisify(conn.commit).bind(conn);
    const _query = util.promisify(conn.query).bind(conn)
    await beginTxn();
    try {
        for (const stmt of stmts) {
            // await _query(stmt);
            await run(stmt, _query);
        }
        await commit();
        done = true
    } catch (e) {
        LOG.info({message:'db transaction failed, rolling back', stmts, error: e});
        await rollback();
    } finally {
        conn.release()
    }
    return done
}


/**
 * Handle sequential INSERT/UPDATE statements in a transaction
 * @param updateStmts: list of INSERT/UPDATE statements
 * @param readStmt: single mysql statement to be fired before committing the transaction, this is returned
 * @param klass: type cast query result of getStmt
 */
const updateAndGetTxn = async<K>(updateStmts: string[], readStmt: string, klass: any): Promise<K | null> => {
    type T = z.infer<typeof klass.schema>;
    let result = null;
    const conn = await getConn();
    const beginTxn = util.promisify(conn.beginTransaction).bind(conn);
    const rollback = util.promisify(conn.rollback).bind(conn);
    const commit = util.promisify(conn.commit).bind(conn);
    const connQuery = util.promisify(conn.query).bind(conn)
    await beginTxn();
    try {
        for (const stmt of updateStmts) {
            // await connQuery(stmt);
            await run(stmt, connQuery);
        }
        const r = await connQuery(readStmt) as T[]
        if (r.length > 0) {
            // instantiate object of class K
            result = klass({
                ...r[0],
                currentActive: Boolean(Buffer.from(r[0].currentActive).readUInt8()).valueOf()
            }) as K
        }
        await commit();
    } catch (e) {
        LOG.info({message:'db transaction failed, rolling back', updateStmts, getStmt: readStmt, error: e});
        await rollback();
    } finally {
        conn.release()
    }
    return result
}



export const DB = { get, all, update, updateTxn, updateAndGetTxn }
