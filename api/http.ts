import { MethodNotAllowedError } from './errors';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export function checkMethod(req: Request, allowedMethods: HttpMethod[]) {
  const allowed = new Set<HttpMethod>(allowedMethods);

  if (!allowed.has(req.method as HttpMethod)) {
    throw new MethodNotAllowedError(`Method ${req.method} is not allowed`, allowedMethods);
  }
}
