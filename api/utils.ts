export function getClientIP(request: Request) {
  const xForwardedFor = request.headers.get('x-forwarded-for');

  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  return request.headers.get('cf-connecting-ip') || request.headers.get('x-real-ip') || '127.0.0.1';
}
