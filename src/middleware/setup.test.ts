import { describe, it, expect, vi } from 'vitest';
import { setupLambdaMiddleware } from './setup';
import * as Aws from 'aws-sdk';
import { Context } from 'hono';
import { env } from 'process';

vi.mock('aws-sdk', () => {
    const SecretsManager = {
        getSecretValue: vi.fn().mockReturnThis(),
        promise: vi.fn().mockResolvedValue({
            SecretString: JSON.stringify({
                API_BASE_URL_VERIFIER_FRONTEND: 'https://example.com',
                INIT_TRANSACTION_PATH: '/init',
                GET_WALLET_RESPONSE_PATH: '/wallet-response',
                WALLET_URL: 'https://wallet.example.com',
                WALLET_RESPONSE_PATH: '/wallet-response',
                PUBLIC_URL_VERIFIER_FRONTEND: 'https://public.example.com',
                DYNAMODB_TABLE_VERIFIER_FRONTEND: 'verifier-table',
            }),
        }),
    };
    return { SecretsManager: vi.fn(() => SecretsManager) };
});

describe('setupLambdaMiddleware', () => {
    beforeEach(() => {
        process.env = {
            API_BASE_URL_VERIFIER_FRONTEND: 'https://example.com',
            INIT_TRANSACTION_PATH: '/init',
            GET_WALLET_RESPONSE_PATH: '/wallet-response',
            WALLET_URL: 'https://wallet.example.com',
            WALLET_RESPONSE_PATH: '/wallet-response',
            PUBLIC_URL_VERIFIER_FRONTEND: 'https://public.example.com',
            DYNAMODB_TABLE_VERIFIER_FRONTEND: 'verifier-table'
        };
    });

    it('should set environment variables correctly', async () => {
        const next = vi.fn();
        const c = { env: {} } as Context;

        await setupLambdaMiddleware(c, next);

        expect(process.env.API_BASE_URL_VERIFIER_FRONTEND).toBe('https://example.com');
        expect(process.env.INIT_TRANSACTION_PATH).toBe('/init');
        expect(process.env.GET_WALLET_RESPONSE_PATH).toBe('/wallet-response');
        expect(process.env.WALLET_URL).toBe('https://wallet.example.com');
        expect(process.env.WALLET_RESPONSE_PATH).toBe('/wallet-response');
        expect(process.env.PUBLIC_URL_VERIFIER_FRONTEND).toBe('https://public.example.com');
        expect(process.env.DYNAMODB_TABLE_VERIFIER_FRONTEND).toBe('verifier-table');
        expect(next).toHaveBeenCalled();
    });

    it('should handle errors when retrieving secrets', async () => {
        const next = vi.fn();
        const c = { env: {} } as Context;

        vi.mock('aws-sdk', () => {
            const SecretsManager = {
                getSecretValue: vi.fn().mockReturnThis(),
                promise: vi.fn().mockRejectedValue(new Error('Error retrieving secret')),
            };
            return { SecretsManager: vi.fn(() => SecretsManager) };
        });

        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        await setupLambdaMiddleware(c, next);

        expect(consoleErrorSpy).toHaveBeenCalledWith('Error retrieving secret: Error: Error retrieving secret');
        expect(next).toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
    });
});
