import { v4 as uuidv4 } from 'uuid';
import {
  InitTransaction,
  InitTransactionRequest,
  InitTransactionResponse,
  InitTransactionResponseSchema,
  InitTransactionResult,
} from '../ports/input';
import { StorePresentationId } from '../ports/out/session';
import { Fetcher } from '../utils/Fetcher';
import { URLBuilder } from '../utils/URLBuilder';

/**
 * Creates an invoker for the InitTransaction service
 * @param {string} baseUrl - The base url
 * @param {string} apiPath - The api path
 * @param {StorePresentationId} storePresentationId - The store presentation id function
 * @returns {InitTransaction} The InitTransaction service invoker
 */
export const createInitTransactionServiceInvoker = (
  baseUrl: string,
  apiPath: string,
  deployEnv: string,
  storePresentationId: StorePresentationId,
  endpoint: Service
): InitTransaction => {
  return async (
    request: InitTransactionRequest
  ): Promise<InitTransactionResult> => {
    const url = new URLBuilder({ baseUrl, path: apiPath }).build();
    const sessionId = uuidv4();
    const response = InitTransactionResponse.fromJSON(
      await Fetcher.post(
        apiPath,
        endpoint,
        url,
        JSON.stringify(request),
        InitTransactionResponseSchema,
        deployEnv
      )
    );
    await storePresentationId(sessionId, response.presentationId);

    return {
      sessionId,
      response,
    };
  };
};
