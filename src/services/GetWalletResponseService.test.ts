import { createLoadPresentationIdInvoker } from '../adapters/out/session';
import { GetWalletResponse } from '../ports/input';
import { createGetWalletResponseServiceInvoker } from './GetWalletResponseService';

const apiBaseUrl = 'https://dev.verifier-backend.eudiw.dev';
const apiPath = '/ui/presentations';

describe('GetWalletResponseService', () => {
  it('should return a GetWalletResponseService', async () => {
    const invoker = createGetWalletResponseServiceInvoker(
      apiBaseUrl,
      apiPath,
      createLoadPresentationIdInvoker()
    );
    expectTypeOf(invoker).toEqualTypeOf<GetWalletResponse>();
  });
});
