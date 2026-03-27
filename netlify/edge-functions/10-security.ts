import type { Config, Context } from '@netlify/edge-functions';
import { CSP_NONCE_PLACEHOLDER, GOOGLE_ACCOUNTS_ORIGIN } from '@shared/constants';

export const config: Config = {
  path: '/*',
  excludedPath: [
    '/*.js',
    '/*.css',
    '/*.png',
    '/*.jpg',
    '/*.svg',
    '/*.ico',
    '/*.webmanifest',
    '/*.woff2',
    '/*.woff',
    '/*.ttf',
  ],
};

export default async (req: Request, ctx: Context) => {
  console.log('request url:', req.url);

  const res = await ctx.next();
  const contentType = res.headers.get('content-type');

  if (!contentType?.includes('text/html')) return res;
  console.log('Injecting csp nonce...');

  const randomBytes = crypto.getRandomValues(new Uint8Array(16));
  const nonce = Buffer.from(randomBytes).toString('base64');

  const csp = [
    `default-src 'none'`,
    `script-src 'self' 'nonce-${nonce}' ${GOOGLE_ACCOUNTS_ORIGIN} 'strict-dynamic'`,
    `style-src 'self' 'nonce-${nonce}' ${GOOGLE_ACCOUNTS_ORIGIN}`,
    `img-src 'self' https://*.googleusercontent.com`,
    `font-src 'self'`,
    `connect-src 'self' ${GOOGLE_ACCOUNTS_ORIGIN}`,
    `frame-src ${GOOGLE_ACCOUNTS_ORIGIN}`,
    `worker-src 'self' blob:`,
    `frame-ancestors ${GOOGLE_ACCOUNTS_ORIGIN}`,
  ];

  const permissions = [
    'geolocation=()',
    'midi=()',
    'payment=()',
    'camera=()',
    'microphone=()',
    'usb=()',
    'fullscreen=(self)',
  ];

  const html = await res.text();
  const htmlWithNonce = html.replaceAll(CSP_NONCE_PLACEHOLDER, nonce);

  const headers = new Headers(res.headers);
  headers.set('Content-Security-Policy-Report-Only', csp.join('; '));
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Permissions-Policy', permissions.join(', '));

  return new Response(htmlWithNonce, {
    status: res.status,
    headers,
  });
};
