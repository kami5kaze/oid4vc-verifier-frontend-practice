import { InitTransactionRequest } from '../domain/InitTransactionRequest';
import { createInitTransactionServiceInvoker } from './InitTransactionService';
import { describe, it, expect } from 'vitest';
import { createStorePresentationIdInvoker } from '../adapters/out/session/PresentationIdInMemory';
import { presentationDefinition } from '../data/mDL';

const apiBaseUrl = 'https://dev.verifier-backend.eudiw.dev';
const apiPath = '/ui/presentations';

describe('InitTransactionService', () => {
  describe('invoke init Transaction', () => {
    it('should return a transaction object', async () => {
      const invoker = createInitTransactionServiceInvoker(
        apiBaseUrl,
        apiPath,
        createStorePresentationIdInvoker()
      );
      const request = InitTransactionRequest.fromJSON({
        type: 'vp_token',
        presentation_definition: presentationDefinition('1234'),
        nonce: '1234',
        wallet_response_redirect_uri_template:
          'http://localhost:8787/result?response_code={RESPONSE_CODE}',
      });
      const transaction = await invoker(request);
      expect(transaction).toBeDefined();
    });
  });
});
