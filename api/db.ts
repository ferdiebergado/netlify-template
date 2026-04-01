import {
  createClient,
  type Client,
  type InArgs,
  type InStatement,
  type ResultSet,
  type Row,
} from '@libsql/client';
import { env } from './config';
import logger from './logger';

export type TResultSet<T> = Omit<ResultSet, 'rows'> & {
  rows: T[];
};

export interface Database {
  execute<T = Row>(stmt: InStatement): Promise<TResultSet<T>>;
  execute<T = Row>(sql: string, args?: InArgs): Promise<TResultSet<T>>;
  close: () => void;
}

export const db = createClient({
  url: env.DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

export async function runInTransaction<TArgs extends unknown[], TReturn>(
  db: Client,
  fn: (tx: Database, ...args: TArgs) => Promise<TReturn>,
  args: TArgs
): Promise<TReturn> {
  logger.info('Beginning transaction...');

  const tx = await db.transaction();

  try {
    const res = await fn(tx, ...args);
    logger.info('Committing transaction...');
    await tx.commit();
    return res;
  } catch (error) {
    logger.error('Transaction failed:', error);
    logger.info('Rolling back transaction...');
    await tx.rollback();
    throw error;
  } finally {
    logger.info('Closing transaction...');
    tx.close();
  }
}
