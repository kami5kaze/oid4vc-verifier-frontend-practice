import { GetWalletResponseRequest } from "../../domain/GetWalletResponseRequest";
import { GetWalletResponseResponse } from "../../domain/GetWalletResponseResponse";

export interface GetWalletResponse {
  (
    request: GetWalletResponseRequest,
    presentationId: string
  ): Promise<GetWalletResponseResponse>;
}
