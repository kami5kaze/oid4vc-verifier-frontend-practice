import { describe, it, expect, vi } from 'vitest';
import { LambdaPortsOutImpl, createDynamoDBClient } from './LambdaPortsOutImpl';
import { Context } from 'hono';
import { Env } from '../env';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { PresentationIdDynamo } from '../adapters/out/session/PresentationIdDynamo';

vi.mock('@aws-sdk/client-dynamodb');
vi.mock('@aws-sdk/lib-dynamodb');
vi.mock('../adapters/out/session/PresentationIdDynamo');
vi.mock('oid4vc-core/dynamodb');

process.env = {
    ...process.env,
    AWS_ACCESS_KEY_ID: 'test-access-key-id',
    AWS_SECRET_ACCESS_KEY: 'test-secret-access-key',
    DYNAMODB_TABLE_VERIFIER_FRONTEND: 'test-table',
    DYNAMODB_ENDPOINT: 'http://localhost:8000',
    AWS_REGION: 'us-east-1',
};

describe('LambdaPortsOutImpl', () => {
    let ctxMock: Context<Env>;
    let lambdaPortsOut: LambdaPortsOutImpl;

    beforeEach(() => {
        ctxMock = {
            env: {
                AWS_ACCESS_KEY_ID: 'test-access-key-id',
                AWS_SECRET_ACCESS_KEY: 'test-secret-access-key',
                DYNAMODB_TABLE_VERIFIER_FRONTEND: 'test-table',
                DYNAMODB_ENDPOINT: 'http://localhost:8000',
                AWS_REGION: 'us-east-1',
            },
        } as unknown as Context<Env>;

        lambdaPortsOut = new LambdaPortsOutImpl(ctxMock);
    });

    it('should store presentationId correctly', async () => {
        const sessionId = 'session1';
        const presentationId = 'presentation1';
        const storePresentationIdMock = vi.fn();

        PresentationIdDynamo.prototype.storePresentationId = storePresentationIdMock;

        await lambdaPortsOut.storePresentationId(sessionId, presentationId);

        expect(storePresentationIdMock).toHaveBeenCalledWith(sessionId, presentationId);
    });

    it('should load presentationId correctly', async () => {
        const sessionId = 'session1';
        const presentationId = 'presentation1';
        const loadPresentationIdMock = vi.fn().mockResolvedValue(presentationId);

        PresentationIdDynamo.prototype.loadPresentationId = loadPresentationIdMock;

        const loadedPresentationId = await lambdaPortsOut.loadPresentationId(sessionId);

        expect(loadedPresentationId).toBe(presentationId);
    });
});