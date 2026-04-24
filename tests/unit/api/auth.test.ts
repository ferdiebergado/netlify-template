import { verifyToken } from '@api/auth';
import { UnauthorizedError } from '@api/errors';
import { GOOGLE_ACCOUNTS_ORIGIN } from '@shared/constants';
import type { CreateUser } from '@shared/schemas/user.schema';
import type { OAuth2Client, TokenPayload } from 'google-auth-library';
import { describe, expect, it, vi } from 'vitest';

const createMockClient = (options?: {
  payload?: Partial<TokenPayload>;
  throws?: boolean;
  errorMessage?: string;
}) => {
  const mockClient = {
    verifyIdToken: vi.fn(),
  };

  if (options?.throws) {
    mockClient.verifyIdToken.mockRejectedValue(
      new Error(options.errorMessage || 'Token verification failed')
    );
  } else {
    mockClient.verifyIdToken.mockResolvedValue({
      getPayload: () => options?.payload,
    });
  }

  return mockClient as unknown as OAuth2Client;
};

describe('verifyToken', () => {
  describe('successful verification', () => {
    it('returns user for valid payload and issuer', async () => {
      const payload = {
        iss: GOOGLE_ACCOUNTS_ORIGIN,
        sub: '123',
        name: 'Alice',
        email: 'alice@example.com',
        picture: 'https://example.com/alice.jpg',
      };
      const oauthClient = createMockClient({ payload });

      const user = await verifyToken(oauthClient, 'token123');

      expect(user).toEqual<CreateUser>({
        name: 'Alice',
        email: 'alice@example.com',
        picture: 'https://example.com/alice.jpg',
        googleId: payload.sub,
      });
    });
  });

  describe('token verification failures', () => {
    it('throws UnauthorizedError when token verification fails', async () => {
      const oauthClient = createMockClient({
        throws: true,
        errorMessage: 'Invalid token',
      });

      await expect(verifyToken(oauthClient, 'invalid-token')).rejects.toBeInstanceOf(Error);
      await expect(verifyToken(oauthClient, 'invalid-token')).rejects.toThrow('Invalid token');
    });

    it('throws UnauthorizedError when token verification fails with generic error', async () => {
      const oauthClient = createMockClient({
        throws: true,
      });

      await expect(verifyToken(oauthClient, 'invalid-token')).rejects.toBeInstanceOf(Error);
      await expect(verifyToken(oauthClient, 'invalid-token')).rejects.toThrow(
        'Token verification failed'
      );
    });
  });

  describe('payload validation', () => {
    it('throws UnauthorizedError if payload is undefined', async () => {
      const oauthClient = createMockClient();

      await expect(verifyToken(oauthClient, 'token123')).rejects.toBeInstanceOf(UnauthorizedError);
      await expect(verifyToken(oauthClient, 'token123')).rejects.toMatchObject({
        message: 'Invalid token payload',
      });
    });
  });

  describe('issuer validation', () => {
    it('throws UnauthorizedError for invalid issuer', async () => {
      const oauthClient = createMockClient({
        payload: {
          iss: 'https://bad-issuer.example.com',
          sub: '123',
        },
      });

      await expect(verifyToken(oauthClient, 'token123')).rejects.toBeInstanceOf(UnauthorizedError);
      await expect(verifyToken(oauthClient, 'token123')).rejects.toMatchObject({
        message: 'Invalid issuer',
      });
    });

    it('throws UnauthorizedError for missing issuer', async () => {
      const oauthClient = createMockClient({
        payload: {
          sub: '123',
          // iss is missing
        },
      });

      await expect(verifyToken(oauthClient, 'token123')).rejects.toBeInstanceOf(UnauthorizedError);
      await expect(verifyToken(oauthClient, 'token123')).rejects.toMatchObject({
        message: 'Invalid issuer',
      });
    });
  });

  describe('edge cases', () => {
    it('throws UnauthorizedError for empty sub', async () => {
      const oauthClient = createMockClient({
        payload: {
          iss: GOOGLE_ACCOUNTS_ORIGIN,
          sub: '',
          name: 'Alice',
          email: 'alice@example.com',
        },
      });

      const user = await verifyToken(oauthClient, 'token123');

      expect(user).toEqual<CreateUser>({
        name: 'Alice',
        email: 'alice@example.com',
        picture: undefined,
        googleId: '',
      });
    });

    it('handles null values in payload gracefully', async () => {
      const payload = {
        iss: GOOGLE_ACCOUNTS_ORIGIN,
        sub: '123',
        email: 'alice@example.com',
      };
      const oauthClient = createMockClient({ payload });

      const user = await verifyToken(oauthClient, 'token123');

      expect(user).toEqual<CreateUser>({
        email: 'alice@example.com',
        googleId: payload.sub,
        name: undefined,
        picture: undefined,
      });
    });
  });
});
