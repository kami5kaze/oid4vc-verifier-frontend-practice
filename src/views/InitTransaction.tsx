import { FC } from 'hono/jsx';
import { hc } from 'hono/client';
import { ApiRoutes } from '..';
import { useRequestContext } from 'hono/jsx-renderer';
import { API_PATH } from '../consts';
import { InitTransactionResponse } from '../types/InitTransactionResponse';
import { URLBuilder } from '../utils/URLBuilder';
import parser from 'ua-parser-js';

export const InitiateTransaction: FC = async () => {
  const ctx = useRequestContext();
  const ua = parser(ctx.req.raw.headers.get('User-Agent')!);
  console.log('ua :>> ', ua);
  const client = hc<ApiRoutes>(`${ctx.env.PUBLIC_URL}${API_PATH}`);
  const res = await client.init.$post();
  const initTransactionResponse = await InitTransactionResponse.fromResponse(
    res
  );
  const redirectUrl = new URLBuilder(
    ctx.env.WALLET_URL,
    initTransactionResponse.toWalletRedirectParams()
  ).build();

  return (
    <section>
      <h1>Initiate Transaction</h1>
      <a href={redirectUrl}>Redirect to Wallet</a>
    </section>
  );
};
