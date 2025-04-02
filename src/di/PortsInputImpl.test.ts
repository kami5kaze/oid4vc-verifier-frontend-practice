import { describe, it, expect } from 'vitest';
import { Context } from 'hono';
import { PortsInImpl } from './PortsInputImpl';
import { Configuration } from './Configuration';
import { PortsOut } from './PortsOut';

describe('PortsInImpl', () => {
    it('should return the correct InitTransaction and GetWalletResponse instances', () => {
        const mockConfig = {
            apiBaseUrl: 'https://api.example.com',
            initTransactionPath: '/init-transaction',
            getWalletResponsePath: '/get-wallet-response',
        } as Configuration;

        const mockPortsOut = {
            storePresentationId: vi.fn(),
            loadPresentationId: vi.fn(),
        } as unknown as PortsOut;

        const mockContext = {
            env: {
                BACKEND: 'backend-service',
            },
        } as Context;

        const portsIn = new PortsInImpl(mockConfig, mockPortsOut, mockContext);

        expect(portsIn.initTransaction).toBeInstanceOf(Object);
        expect(portsIn.getWalletResponse).toBeInstanceOf(Object);
    });

    it('should throw an error if config is null', () => {
        const mockPortsOut = {
            storePresentationId: vi.fn(),
            loadPresentationId: vi.fn(),
        } as unknown as PortsOut;

        const mockContext = {
            env: {
                BACKEND: 'backend-service',
            },
        } as Context;

        expect(() => new PortsInImpl(null as unknown as Configuration, mockPortsOut, mockContext)).toThrow();
    });

    it('should throw an error if portsOut is null', () => {
        const mockConfig = {
            apiBaseUrl: 'https://api.example.com',
            initTransactionPath: '/init-transaction',
            getWalletResponsePath: '/get-wallet-response',
        } as Configuration;

        const mockContext = {
            env: {
                BACKEND: 'backend-service',
            },
        } as Context;

        expect(() => new PortsInImpl(mockConfig, null as unknown as PortsOut, mockContext)).toThrow();
    });

    it('should throw an error if context is null', () => {
        const mockConfig = {
            apiBaseUrl: 'https://api.example.com',
            initTransactionPath: '/init-transaction',
            getWalletResponsePath: '/get-wallet-response',
        } as Configuration;

        const mockPortsOut = {
            storePresentationId: vi.fn(),
            loadPresentationId: vi.fn(),
        } as unknown as PortsOut;

        expect(() => new PortsInImpl(mockConfig, mockPortsOut, null as unknown as Context)).toThrow();
    });
});