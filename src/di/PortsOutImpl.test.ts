import { describe, it, expect } from 'vitest';
import { Context } from 'hono';
import { PortsOutImpl } from './PortsOutImpl';
import { Env } from '../env';

describe('PortsOutImpl', () => {
    it('should return the correct StorePresentationId and LoadPresentationId instances', () => {
        const mockContext = {
            env: {
                PRESENTATION_ID_KV: {},
            },
        } as Context<Env>;

        const portsOut = new PortsOutImpl(mockContext);

        expect(portsOut.storePresentationId).toBeInstanceOf(Function);
        expect(portsOut.loadPresentationId).toBeInstanceOf(Function);
    });

    it('should throw an error if context is null', () => {
        expect(() => new PortsOutImpl(null as unknown as Context<Env>)).toThrow();
    });

    it('should throw an error if context.env is undefined', () => {
        const mockContext = {} as Context<Env>;
        expect(() => new PortsOutImpl(mockContext)).toThrow();
    });
});
