import { Context } from 'hono';
import { Env } from '../env';
import { GetWalletResponse, InitTransaction } from '../ports/input';
import {
  createGetWalletResponseServiceInvoker,
  createInitTransactionServiceInvoker,
} from '../services';
import { Configuration } from './Configuration';
import { PortsIn } from './PortsInput';
import { PortsOut } from './PortsOut';

export class PortsInImpl implements PortsIn {
  #initTransaction: InitTransaction;
  #getWalletResponse: GetWalletResponse;

  constructor(config: Configuration, portsOut: PortsOut, ctx: Context<Env>) {
    this.#initTransaction = createInitTransactionServiceInvoker(
      config.apiBaseUrl,
      config.initTransactionPath,
      portsOut.storePresentationId,
      ctx.env.BACKEND
    );
    this.#getWalletResponse = createGetWalletResponseServiceInvoker(
      config.apiBaseUrl,
      config.getWalletResponsePath,
      portsOut.loadPresentationId,
      ctx.env.BACKEND
    );
  }

  get initTransaction(): InitTransaction {
    return this.#initTransaction;
  }

  get getWalletResponse(): GetWalletResponse {
    return this.#getWalletResponse;
  }
}
