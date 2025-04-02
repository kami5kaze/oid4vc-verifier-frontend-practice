import { describe, it, expect, vi } from 'vitest';
import { getDI } from './getDI';
import { Context } from 'hono';
import { Env } from '../../env';
import { HonoConfiguration } from '../../di/HonoConfiguration';
import { PortsOutImpl } from '../../di/PortsOutImpl';
import { PortsInImpl } from '../../di/PortsInputImpl';

vi.mock('../../di/HonoConfiguration');
vi.mock('../../di/PortsOutImpl');
vi.mock('../../di/PortsInputImpl');

describe('getDI', () => {
    let ctxMock: Context<Env>;

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
    });

    it('should create DI objects correctly', () => {
        const { config, portsOut, portsIn } = getDI(ctxMock);

        expect(config).toBeInstanceOf(HonoConfiguration);
        expect(portsOut).toBeInstanceOf(PortsOutImpl);
        expect(portsIn).toBeInstanceOf(PortsInImpl);
    });
});