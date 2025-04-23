import { describe, expect, it, vi } from 'vitest';
import { createStorePresentationIdInvoker } from '../adapters/out/session';
import { presentationDefinition } from '../data/mDL';
import { InitTransactionRequest } from '../ports/input';
import { createInitTransactionServiceInvoker } from './InitTransactionService';

const apiBaseUrl = 'https://dev.verifier-backend.eudiw.dev';
const apiPath = '/ui/presentations';

vi.mock('../adapters/out/session', () => ({
  createStorePresentationIdInvoker: vi.fn(),
}));

describe('InitTransactionService', () => {
  it('should return a transaction object on success', async () => {
    const storePresentationId = vi.fn();
    const endpoint: Service = {
      fetch: vi.fn().mockResolvedValue(
        new Response(JSON.stringify({
          presentation_id: 'test_presentation_id',
          client_id: 'test_client_id',
        }), {
          status: 200,
          statusText: 'OK',
          headers: new Headers(),
        })
      ),
      connect: vi.fn(),
    };
    const invoker = createInitTransactionServiceInvoker(
      apiBaseUrl,
      apiPath,
      storePresentationId,
      endpoint
    );
    const request = InitTransactionRequest.fromJSON({
      type: 'vp_token',
      presentation_definition: presentationDefinition('1234'),
      nonce: '1234',
      response_mode: 'direct_post',
      jar_mode: 'by_value',
      presentation_definition_mode: 'by_value',
      wallet_response_redirect_uri_template: 'http://localhost:8787/result?response_code={RESPONSE_CODE}',
    });
    const transaction = await invoker(request);

    expect(transaction).toBeDefined();
    expect(transaction.sessionId).toBeDefined();
    expect(transaction.response.presentationId).toBe('test_presentation_id');
    expect(storePresentationId).toHaveBeenCalledWith(transaction.sessionId, 'test_presentation_id');
  });

  it('should throw an error on failure', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve(new Response(JSON.stringify({
        error: 'Invalid request'
      }), {
        status: 400,
        statusText: 'Bad Request',
        headers: new Headers()
      }))
    );

    const storePresentationId = createStorePresentationIdInvoker();
    const endpoint: Service = {
      fetch: vi.fn().mockResolvedValue(
        new Response(JSON.stringify({
          error: 'Invalid request'
        }), {
          status: 400,
          statusText: 'Bad Request',
          headers: new Headers()
        })
      ),
      connect: vi.fn(),
    };
    const invoker = createInitTransactionServiceInvoker(
      apiBaseUrl,
      apiPath,
      storePresentationId,
      endpoint
    );
    const request = InitTransactionRequest.fromJSON({
      type: 'vp_token',
      presentation_definition: presentationDefinition('1234'),
      nonce: '1234',
      wallet_response_redirect_uri_template: 'http://localhost:8787/result?response_code={RESPONSE_CODE}',
    });

    await expect(invoker(request)).rejects.toThrow('Status: 400, Message: Bad Request');
  });
});
