import type { Config, Context } from '@netlify/edge-functions';

import { CSP_NONCE_PLACEHOLDER, GOOGLE_ACCOUNTS_ORIGIN } from '../../shared/constants';
import { generateRandomBytes } from '../../shared/lib/crypto';

// Security headers configuration
const SECURITY_HEADERS = {
  // Content Security Policy configuration
  CSP_DIRECTIVES: {
    'default-src': ["'none'"],
    'script-src': [
      "'self'",
      GOOGLE_ACCOUNTS_ORIGIN,
      "'strict-dynamic'", // Enables strict dynamic for better XSS protection
    ],
    'style-src': ["'self'", GOOGLE_ACCOUNTS_ORIGIN],
    'img-src': ["'self'", 'https://*.googleusercontent.com'],
    'font-src': ["'self'"],
    'connect-src': ["'self'", GOOGLE_ACCOUNTS_ORIGIN],
    'worker-src': ["'self'", 'blob:'],
    'frame-src': [GOOGLE_ACCOUNTS_ORIGIN],
    'frame-ancestors': [GOOGLE_ACCOUNTS_ORIGIN],
    'base-uri': ["'none'"], // Prevents <base> manipulation
    'form-action': ["'self'"], // Restricts where forms can submit
    'upgrade-insecure-requests': [], // Forces HTTPS upgrades
  },

  // Permissions Policy directives
  PERMISSIONS_POLICY: {
    geolocation: '()',
    midi: '()',
    payment: '()',
    camera: '()',
    microphone: '()',
    usb: '()',
    fullscreen: 'self',
    accelerometer: '()',
    'ambient-light-sensor': '()',
    autoplay: '()',
    battery: '()',
    'clipboard-read': '()',
    'clipboard-write': '()',
    'display-capture': '()',
    'document-domain': '()',
    'encrypted-media': '()',
    'execution-while-not-rendered': '()',
    'execution-while-out-of-viewport': '()',
    gamepad: '()',
    hid: '()',
    'identity-credentials-get': '()',
    'idle-detection': '()',
    'local-fonts': '()',
    magnetometer: '()',
    'microphone-map': '()',
    'otp-credentials': '()',
    'payment-handler': '()',
    'picture-in-picture': '()',
    'publickey-credentials-create': '()',
    'publickey-credentials-get': '()',
    'screen-wake-lock': '()',
    serial: '()',
    'speaker-selection': '()',
    'storage-access': '()',
    'sync-xhr': '()',
    'unoptimized-images': '()',
    'unoptimized-video': '()',
    'vertical-scroll': '()',
    'web-share': '()',
    'window-management': '()',
    'xr-spatial-tracking': '()',
  },

  // Other security headers
  REFERRER_POLICY: 'strict-origin-when-cross-origin',
  X_CONTENT_TYPE_OPTIONS: 'nosniff',
  X_FRAME_OPTIONS: 'DENY', // Additional protection against clickjacking
};

// File extensions to exclude from processing
const EXCLUDED_EXTENSIONS = [
  '.js',
  '.css',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.ico',
  '.webmanifest',
  '.woff2',
  '.woff',
  '.ttf',
  '.eot',
  '.otf',
  '.mp4',
  '.webm',
  '.ogg',
  '.mp3',
  '.wav',
];

export const config: Config = {
  path: '/*',
  excludedPath: EXCLUDED_EXTENSIONS.map(ext => `/*${ext}` as const),
};

/**
 * Builds a Content Security Policy string from directives
 * @param directives Object mapping directive names to their values
 * @param nonce Optional nonce to include in script/style-src
 * @returns Formatted CSP string
 */
function buildCSP(directives: Record<string, string[]>, nonce?: string): string {
  return Object.entries(directives)
    .map(([directive, values]) => {
      // Add nonce to script-src and style-src if provided
      if ((directive === 'script-src' || directive === 'style-src') && nonce) {
        values = [...values, `'nonce-${nonce}'`];
      }
      return `${directive} ${values.join(' ')}`;
    })
    .join('; ');
}

/**
 * Builds a Permissions Policy string from directives
 * @param directives Object mapping feature names to their allowlists
 * @returns Formatted Permissions Policy string
 */
function buildPermissionsPolicy(directives: Record<string, string>): string {
  return Object.entries(directives)
    .map(([feature, allowlist]) => {
      // For empty allowlists, use empty parentheses to deny all
      if (allowlist === '()') {
        return `${feature}=()`;
      }
      // For self allowlists, use self without parentheses
      if (allowlist === 'self') {
        return `${feature}=self`;
      }
      return `${feature}=${allowlist}`;
    })
    .join(', ');
}

export default async (req: Request, ctx: Context) => {
  console.log(`Processing security headers for: ${req.url}`);

  const res = await ctx.next();
  const contentType = res.headers.get('content-type');

  // Only process HTML responses
  if (!contentType?.includes('text/html')) return res;

  console.log('Injecting CSP nonce...');

  // Generate a secure nonce for this request
  const nonce = generateRandomBytes(16);

  // Build security headers
  const csp = buildCSP(SECURITY_HEADERS.CSP_DIRECTIVES, nonce);
  const permissions = buildPermissionsPolicy(SECURITY_HEADERS.PERMISSIONS_POLICY);

  // Process HTML content
  const html = await res.text();
  const htmlWithNonce = html.replaceAll(CSP_NONCE_PLACEHOLDER, nonce);

  // Create new headers with security enhancements
  const headers = new Headers(res.headers);
  headers.set('Content-Security-Policy', csp);
  headers.set('Permissions-Policy', permissions);
  headers.set('Referrer-Policy', SECURITY_HEADERS.REFERRER_POLICY);
  headers.set('X-Content-Type-Options', SECURITY_HEADERS.X_CONTENT_TYPE_OPTIONS);
  headers.set('X-Frame-Options', SECURITY_HEADERS.X_FRAME_OPTIONS);

  return new Response(htmlWithNonce, {
    status: res.status,
    headers,
  });
};
