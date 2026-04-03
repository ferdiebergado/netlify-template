import { describe, expect, it, vi } from 'vitest';
import * as z from 'zod';

import { BadRequestError, MethodNotAllowedError } from '@api/errors';
import { checkMethod, parseJson } from '@api/http';

const testUrl = 'http://localhost:8888/test';

vi.mock('@api/logger', () => ({
  default: {
    error: vi.fn(),
  },
}));

describe('checkMethod', () => {
  describe('when method is allowed', () => {
    it('does not throw an error for GET request', () => {
      const req = new Request(testUrl, { method: 'GET' });
      expect(() => {
        checkMethod(req, ['GET']);
      }).not.toThrow();
    });

    it('does not throw an error for POST request', () => {
      const req = new Request(testUrl, { method: 'POST' });
      expect(() => {
        checkMethod(req, ['POST']);
      }).not.toThrow();
    });

    it('does not throw an error when multiple methods are allowed and request uses one of them', () => {
      const req = new Request(testUrl, { method: 'PUT' });
      expect(() => {
        checkMethod(req, ['GET', 'POST', 'PUT']);
      }).not.toThrow();
    });
  });

  describe('when method is not allowed', () => {
    it('throws MethodNotAllowedError for disallowed method', () => {
      const req = new Request(testUrl, { method: 'DELETE' });
      expect(() => {
        checkMethod(req, ['GET', 'POST']);
      }).toThrow(MethodNotAllowedError);
    });

    it('throws MethodNotAllowedError with correct message', () => {
      const req = new Request(testUrl, { method: 'PATCH' });
      expect(() => {
        checkMethod(req, ['GET']);
      }).toThrow('Method PATCH is not allowed');
    });

    it('throws MethodNotAllowedError with allowed methods in error object', () => {
      const req = new Request(testUrl, { method: 'DELETE' });
      try {
        checkMethod(req, ['GET', 'POST']);
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(MethodNotAllowedError);
        if (error instanceof MethodNotAllowedError) {
          expect(error.allowedmethods).toEqual(['GET', 'POST']);
        }
      }
    });
  });
});

describe('parseJson', () => {
  describe('when JSON is valid and matches schema', () => {
    it('returns parsed data for valid JSON', async () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      const validData = { name: 'John', age: 30 };
      const req = new Request(testUrl, {
        method: 'POST',
        body: JSON.stringify(validData),
      });

      const result = await parseJson(req, schema);
      expect(result).toEqual(validData);
    });

    it('returns parsed data for complex schema', async () => {
      const schema = z.object({
        user: z.object({
          id: z.number(),
          profile: z.object({
            email: z.email(),
            preferences: z.array(z.string()),
          }),
        }),
      });

      const validData = {
        user: {
          id: 123,
          profile: {
            email: 'john@example.com',
            preferences: ['news', 'sports'],
          },
        },
      };

      const req = new Request(testUrl, {
        method: 'POST',
        body: JSON.stringify(validData),
      });

      const result = await parseJson(req, schema);
      expect(result).toEqual(validData);
    });
  });

  describe('when JSON is invalid', () => {
    it('throws BadRequestError for malformed JSON', async () => {
      const schema = z.object({
        name: z.string(),
      });

      const req = new Request(testUrl, {
        method: 'POST',
        body: 'invalid json',
      });

      await expect(parseJson(req, schema)).rejects.toThrow(BadRequestError);
      await expect(parseJson(req, schema)).rejects.toThrow('Invalid JSON body');
    });

    it('throws BadRequestError when schema validation fails', async () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      const invalidData = { name: 'John', age: 'thirty' }; // age should be number
      const req = new Request(testUrl, {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      await expect(parseJson(req, schema)).rejects.toThrow(BadRequestError);
      await expect(parseJson(req, schema)).rejects.toThrow('Invalid JSON body');
    });

    it('logs ZodError field errors when schema validation fails', async () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      const invalidData = { name: 'John', age: 'thirty' };
      const req = new Request(testUrl, {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      // Import the mocked logger
      const logger = await import('@api/logger');

      await expect(parseJson(req, schema)).rejects.toThrow(BadRequestError);

      // Check that logger.error was called with field errors
      expect(logger.default.error).toHaveBeenCalledWith('Failed to parse JSON body', {
        error: { age: ['Invalid input: expected number, received string'] },
      });
    });

    it('logs generic error when non-Zod error occurs', async () => {
      const schema = z.object({
        name: z.string(),
      });

      // Create a mock request that throws a non-Zod error when json() is called
      const req = {
        json: vi.fn().mockRejectedValue(new Error('Network error')),
      } as unknown as Request;

      const logger = await import('@api/logger');

      await expect(parseJson(req, schema)).rejects.toThrow(BadRequestError);

      // Check that logger.error was called with the generic error
      expect(logger.default.error).toHaveBeenCalledWith('Failed to parse JSON body', {
        error: new Error('Network error'),
      });
    });
  });

  describe('when request body is empty or null', () => {
    it('throws BadRequestError for empty body', async () => {
      const schema = z.object({
        name: z.string(),
      });

      const req = new Request(testUrl, {
        method: 'POST',
        body: '',
      });

      await expect(parseJson(req, schema)).rejects.toThrow(BadRequestError);
      await expect(parseJson(req, schema)).rejects.toThrow('Invalid JSON body');
    });

    it('throws BadRequestError for null body', async () => {
      const schema = z.object({
        name: z.string(),
      });

      // Create a mock request with null body
      const req = {
        json: vi.fn().mockRejectedValue(new SyntaxError('Unexpected end of JSON input')),
      } as unknown as Request;

      await expect(parseJson(req, schema)).rejects.toThrow(BadRequestError);
      await expect(parseJson(req, schema)).rejects.toThrow('Invalid JSON body');
    });
  });
});
