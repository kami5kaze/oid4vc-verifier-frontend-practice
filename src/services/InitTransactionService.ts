import { InitTransactionRequest } from '../domain/InitTransactionRequest';
import {
  InitTransactionResponse,
  InitTransactionResponseSchema,
} from '../domain/InitTransactionResponse';
import {
  InitTransaction,
  InitTransactionResult,
} from '../ports/input/InitTransaction';
import { StorePresentationId } from '../ports/out/session/StorePresentationId';
import { Fetcher } from '../utils/Fetcher';
import { URLBuilder } from '../utils/URLBuilder';
import { v4 as uuidv4 } from 'uuid';

export const createInitTransactionServiceInvoker = (
  baseUrl: string,
  apiPath: string,
  storePresentationId: StorePresentationId
): InitTransaction => {
  return async (
    request: InitTransactionRequest
  ): Promise<InitTransactionResult> => {
    const url = new URLBuilder({ baseUrl, path: apiPath }).build();
    const sessionId = uuidv4();
    const response = InitTransactionResponse.fromJSON(
      await Fetcher.post(
        url,
        JSON.stringify(request),
        InitTransactionResponseSchema
      )
    );
    await storePresentationId(sessionId, response.presentationId);

    return {
      sessionId,
      response,
    };
  };
};
