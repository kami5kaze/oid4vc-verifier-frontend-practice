import { Context } from 'hono';
import { Env } from './env';
import { AbstractConfiguration } from './AbstractConfiguration';

export class HonoConfiguration extends AbstractConfiguration {
  #ctx?: Context<Env>;

  constructor(ctx?: Context<Env>) {
    super();
    this.#ctx = ctx;
  }

  get baseUrl(): string {
    return this.#ctx?.env.API_BASE_URL ?? '';
  }

  get initTransactionPath(): string {
    return this.#ctx?.env.INIT_TRANSACTION_PATH ?? '';
  }

  get getWalletResponsePath(): string {
    return this.#ctx?.env.WALLET_RESPONSE_PATH ?? '';
  }
}
