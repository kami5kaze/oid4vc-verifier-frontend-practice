import { describe, expect, it, vi } from 'vitest';
import { createGetWalletResponseServiceInvoker } from './GetWalletResponseService';
import { createLoadPresentationIdInvoker } from '../adapters/out/session';

const apiBaseUrl = 'https://dev.verifier-backend.eudiw.dev';
const apiPath = '/ui/wallet-response';

describe('createGetWalletResponseServiceInvoker', () => {
  it('should return a wallet response object on success', async () => {
    const endpoint: Service = {
      fetch: vi.fn().mockResolvedValue(
        new Response(JSON.stringify({
          id_token: 'test_id_token',
          vp_token: 'test_vp_token',
          presentation_submission: undefined,
          error: 'test_error',
          error_description: 'test_error_description',
        }), {
          status: 200,
          statusText: 'OK',
          headers: new Headers(),
        })
      ),
      connect: vi.fn(),
    };
    const invoker = createGetWalletResponseServiceInvoker(
      apiBaseUrl,
      apiPath,
      createLoadPresentationIdInvoker(),
      endpoint
    );

    const response = await invoker('test_session_id', 'test_response_code');

    expect(response).toBeDefined();
    expect(response.idToken).toBe('test_id_token');
    expect(response.vpToken).toBe('test_vp_token');
    expect(response.presentationSubmission).toBeUndefined();
    expect(response.error).toBe('test_error');
    expect(response.error_description).toBe('test_error_description');
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
    const invoker = createGetWalletResponseServiceInvoker(
      apiBaseUrl,
      apiPath,
      createLoadPresentationIdInvoker(),
      endpoint
    );

    await expect(invoker('test_session_id', 'test_response_code')).rejects.toThrow('Status: 400, Message: Bad Request');
  });
});