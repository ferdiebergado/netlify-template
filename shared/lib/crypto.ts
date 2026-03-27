import { randomBytes } from 'node:crypto';

export function generateRandomBytes(length: number): string {
  return randomBytes(length).toString('base64');
}
