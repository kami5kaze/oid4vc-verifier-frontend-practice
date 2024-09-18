import { Context } from 'hono';
import { Env } from '../env';
import { AbstractConfiguration } from './AbstractConfiguration';

/**
 * Configuration class from Hono that implements the Configuration interface
 * @extends {AbstractConfiguration}
 */
export class HonoConfiguration extends AbstractConfiguration {
  #ctx?: Context<Env>;

  /**
   * Constructor of the class
   * @param {Context<Env>} ctx - The context
   */
  constructor(ctx?: Context<Env>) {
    super();
    this.#ctx = ctx;
  }

  get apiBaseUrl(): string {
    return this.#ctx?.env.API_BASE_URL ?? '';
  }

  get initTransactionPath(): string {
    return this.#ctx?.env.INIT_TRANSACTION_PATH ?? '';
  }

  get getWalletResponsePath(): string {
    return this.#ctx?.env.WALLET_RESPONSE_PATH ?? '';
  }

  get walletUrl(): string {
    return this.#ctx?.env.WALLET_URL ?? '';
  }

  get publicUrl(): string {
    return this.#ctx?.env.PUBLCI_URL ?? '';
  }
}
