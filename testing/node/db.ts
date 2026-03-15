import { createClient } from '@libsql/client';
import { readFileSync } from 'node:fs';

import { MIGRATION_FILE } from '@api/constants';
import type { Database } from '@api/db';
import { resolve } from 'node:path';

let schemaCache: string;

export async function createTestDB(): Promise<Database> {
  try {
    const db = createClient({
      url: ':memory:',
    });

    if (!schemaCache) {
      const schemaPath = resolve(process.cwd(), MIGRATION_FILE);
      schemaCache = readFileSync(schemaPath, { encoding: 'utf8' });
    }

    await db.executeMultiple(schemaCache);

    return db;
  } catch (error) {
    console.error('Failed to initialize test DB:', error);
    throw error;
  }
}
