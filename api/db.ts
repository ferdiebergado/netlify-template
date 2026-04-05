import {
  createClient,
  type Client,
  type InArgs,
  type InStatement,
  type ResultSet,
  type Row,
} from '@libsql/client';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import config from './config';
import { MIGRATION_FILE } from './constants';
import logger from './logger';

export type TResultSet<T> = Omit<ResultSet, 'rows'> & {
  rows: T[];
};

export interface Database {
  execute<T = Row>(stmt: InStatement): Promise<TResultSet<T>>;
  execute<T = Row>(sql: string, args?: InArgs): Promise<TResultSet<T>>;
  close: () => void;
}

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

export const db = createClient({
  url: config.databaseUrl,
  authToken: config.tursoAuthToken,
});

try {
  const schemaPath = path.resolve(process.cwd(), MIGRATION_FILE);
  const schema = readFileSync(schemaPath, { encoding: 'utf8' });

  await db.executeMultiple(schema);
} catch (error) {
  logger.error('Failed to initialize the database', error);
  throw error;
}
