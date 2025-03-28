import { Context } from 'hono';
import { AbstractConfiguration } from './AbstractConfiguration';
import { env } from 'hono/adapter';
import { Bindings, Env } from '../env';

/**
 * Configuration class from Hono that implements the Configuration interface
 * @extends {AbstractConfiguration}
 */
export class HonoConfiguration extends AbstractConfiguration {
  #env?: Bindings;

  /**
   * Constructor of the class
   * @param {Context<Env>} ctx - The context
   */
  constructor(ctx?: Context) {
    super();
    this.#env = ctx ? env<Bindings>(ctx) : undefined;
  }

  get apiBaseUrl(): string {
    return this.#env?.API_BASE_URL_VERIFIER_FRONTEND ?? process.env.API_BASE_URL_VERIFIER_FRONTEND ?? '';
  }

  get initTransactionPath(): string {
    return (
      this.#env?.INIT_TRANSACTION_PATH ??
      process.env.INIT_TRANSACTION_PATH ??
      ''
    );
  }

  get getWalletResponsePath(): string {
    return (
      this.#env?.WALLET_RESPONSE_PATH ?? process.env.WALLET_RESPONSE_PATH ?? ''
    );
  }

  get walletUrl(): string {
    return this.#env?.WALLET_URL ?? process.env.WALLET_URL ?? '';
  }

  get publicUrl(): string {
    return this.#env?.PUBLIC_URL_VERIFIER_FRONTEND ?? process.env.PUBLIC_URL_VERIFIER_FRONTEND ?? '';
  }
}
