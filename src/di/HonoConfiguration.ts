import { Context } from 'hono';
import { env } from 'hono/adapter';
import { Bindings, Env } from '../env';
import { AbstractConfiguration } from './AbstractConfiguration';

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
    return (
      this.#env?.API_BASE_URL_VERIFIER_FRONTEND ??
      process.env.API_BASE_URL_VERIFIER_FRONTEND ??
      ''
    );
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
    return (
      this.#env?.PUBLIC_URL_VERIFIER_FRONTEND ??
      process.env.PUBLIC_URL_VERIFIER_FRONTEND ??
      ''
    );
  }

  get switchbotapiUrl(): string {
    return (
      this.#env?.SWITCHBOT_API_URL ??
      process.env.SWITCHBOT_API_URL ??
      ''
    );
  }

  get switchbotapiToken(): string {
    return (
      this.#env?.SWITCHBOT_API_TOKEN ??
      process.env.SWITCHBOT_API_TOKEN ??
      ''
    );
  }

  get switchbotapiSecret(): string {
    return (
      this.#env?.SWITCHBOT_API_SECRET ??
      process.env.SWITCHBOT_API_SECRET ??
      ''
    );
  }

  get hmacKey(): string { 
    return (
      this.#env?.HMAC_KEY ??
      process.env.HMAC_KEY ??
      ''
    );
  }

  get algorithm1(): string {
    return (
      this.#env?.ALGORITHM1 ??
      process.env.ALGORITHM1 ??
      ''
    );
  }

  get algorithm2(): string {
    return (
      this.#env?.ALGORITHM2 ??
      process.env.ALGORITHM2 ??
      ''
    );
  }

  get algorithm3(): string {
    return (
      this.#env?.ALGORITHM3 ??
      process.env.ALGORITHM3 ??
      ''
    );
  }


  get deployEnv(): string {
    return this.#env?.DEPLOY_ENV ?? process.env.DEPLOY_ENV ?? '';
  }
}
