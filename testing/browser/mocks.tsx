import type { ReactNode } from 'react';
import type { UnknownRecord } from 'type-fest';
import { vi } from 'vitest';

vi.mock('@react-oauth/google', () => ({
  GoogleOAuthProvider: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  GoogleLogin: ({ onSuccess }: { onSuccess: (response: UnknownRecord) => void }) => (
    <button onClick={() => onSuccess({ credential: 'mock-token' })}>Sign in</button>
  ),
}));
