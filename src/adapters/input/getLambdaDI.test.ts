import { describe, it, expect } from 'vitest';
import { Context } from 'hono';
import { getLambdaDI } from './getLambdaDI';

describe('getLambdaDI', () => {
    it('should throw an error if context is null', () => {
        expect(() => getLambdaDI(null as unknown as Context)).toThrow();
    });

    it('should throw an error if context is undefined', () => {
        expect(() => getLambdaDI(undefined as unknown as Context)).toThrow();
    });
});
