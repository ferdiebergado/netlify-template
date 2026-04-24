import { createClient, type Client, type Transaction } from '@libsql/client';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import config from './config';
import { MIGRATION_FILE } from './constants';
import { ServiceUnavailableError } from './http/errors';
import logger from './logger';

export async function runInTransaction<TArgs extends unknown[], TReturn>(
  db: Client,
  fn: (tx: Transaction, ...args: TArgs) => Promise<TReturn>,
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
  logger.info('Initializing database schema...');
  const schemaPath = path.resolve(MIGRATION_FILE);
  const schema = readFileSync(schemaPath, { encoding: 'utf8' });

  await db.executeMultiple(schema);
} catch (error) {
  const msg = 'Failed to initialize the database';
  logger.error(msg, error);
  throw new ServiceUnavailableError(msg);
}
