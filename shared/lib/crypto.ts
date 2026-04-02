import { randomBytes } from 'node:crypto';

export function genRandStr(length: number): string {
  return randomBytes(length).toString('base64');
}
