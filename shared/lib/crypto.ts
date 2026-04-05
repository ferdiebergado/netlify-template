import { randomBytes } from 'node:crypto';

export const genRandStr = (length: number): string => randomBytes(length).toString('base64');
