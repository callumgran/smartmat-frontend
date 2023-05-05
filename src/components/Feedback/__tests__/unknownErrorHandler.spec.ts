import { describe, test, expect } from 'vitest';
import { handleUnknownError } from '../unknownErrorHandler';
import { AxiosError } from 'axios';

describe('Test unknown error handler', () => {
  test('Handle generic typescript error', () => {
    const error = new Error('Unknown error');
    const result = handleUnknownError(error);
    expect(result?.message).toEqual('Det oppsto en feil med behandling av forespørselen din.');
    expect(result?.statusCode).toEqual(500);
  });

  test('Test ignores generic typescript with string "classList" (this is a known bug)', () => {
    const error = new Error('classList');
    const result = handleUnknownError(error);
    expect(result).toEqual(null);
  });

  test('Handle unknown axios error', () => {
    const error = new AxiosError('Unknown error');
    const result = handleUnknownError(error);
    expect(result?.message).toEqual('Vi klarte ikke å videreføre din forespørsel riktig');
    expect(result?.statusCode).toEqual(500);
  });
});
