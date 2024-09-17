import { GetWalletResponse } from "../ports/input/GetWalletResponse";
import { InitTransaction } from "../ports/input/InitTransaction";
import { createGetWalletResponseServiceInvoker } from "../services/GetWalletResponseService";
import { createInitTransactionServiceInvoker } from "../services/InitTransactionService";
import { Configuration } from "./Configuration";
import { PortsIn } from "./PortsIn";
import { PortsOut } from "./PortsOut";

export class PortsInImpl implements PortsIn {
  #initTransaction: InitTransaction;
  #getWalletResponse: GetWalletResponse;

  constructor(config: Configuration, portsOut: PortsOut) {
    this.#initTransaction = createInitTransactionServiceInvoker(
      config.baseUrl,
      config.initTransactionPath,
      portsOut.storePresentationId
    );
    this.#getWalletResponse = createGetWalletResponseServiceInvoker(
      config.baseUrl,
      config.getWalletResponsePath
    );
  }

  get initTransaction(): InitTransaction {
    return this.#initTransaction;
  }

  get getWalletResponse(): GetWalletResponse {
    return this.#getWalletResponse;
  }
}
