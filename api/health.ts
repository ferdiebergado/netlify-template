import { type Database } from './db';

export async function checkHealth(db: Database) {
  await db.execute('SELECT 1');
}
