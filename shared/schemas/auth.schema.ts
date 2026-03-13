import * as z from 'zod';

export const signinSchema = z.object({
  token: z.jwt(),
});
