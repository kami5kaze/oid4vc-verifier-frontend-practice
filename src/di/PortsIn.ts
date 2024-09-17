import { GetWalletResponse } from "../ports/input/GetWalletResponse";
import { InitTransaction } from "../ports/input/InitTransaction";

export interface PortsIn {
  get initTransaction(): InitTransaction;
  get getWalletResponse(): GetWalletResponse;
}
