import { describe, expect, it } from 'vitest';
import { db } from './db';
import { checkHealth } from './ping';

describe('checkHealth', () => {
  it('should resolve to undefined', async () => {
    await expect(checkHealth(db)).resolves.toBe(undefined);
  });
});
