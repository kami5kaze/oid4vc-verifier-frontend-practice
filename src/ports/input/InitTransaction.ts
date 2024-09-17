import { InitTransactionResponse } from "../../domain/InitTransactionResponse";
import { InitTransactionRequest } from "../../domain/InitTransactionRequest";

export interface InitTransactionResult {
  sessionId: string;
  response: InitTransactionResponse;
}

export interface InitTransaction {
  (request: InitTransactionRequest): Promise<InitTransactionResult>;
}
