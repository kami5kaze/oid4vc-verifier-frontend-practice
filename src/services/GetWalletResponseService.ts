import {
  GetWalletResponse,
  GetWalletResponseResult,
  GetWalletResponseResultSchema,
} from '../ports/input';
import { LoadPresentationId } from '../ports/out/session';
import { Fetcher } from '../utils/Fetcher';
import { QueryBuilder } from '../utils/QueryBuilder';
import { URLBuilder } from '../utils/URLBuilder';

/**
 * Creates an invoker for the GetWalletResponse service
 * @param {string} baseUrl - The base URL
 * @param {string} apiPath - The API path
 * @param {LoadPresentationId} loadPresentationId - The load presentation id
 * @returns {GetWalletResponse} The GetWalletResponse service invoker
 */
export const createGetWalletResponseServiceInvoker = (
  baseUrl: string,
  apiPath: string,
  deployEnv: string,
  loadPresentationId: LoadPresentationId,
  endpoint: Service
): GetWalletResponse => {
  return async (
    sessionId: string,
    responseCode?: string
  ): Promise<GetWalletResponseResult> => {
    const presentationId = await loadPresentationId(sessionId);
    const url = new URLBuilder({
      baseUrl,
      path: apiPath,
      queryBuilder: new QueryBuilder({
        response_code: responseCode,
      }),
    })
      .replacePathParams({ presentationId: presentationId! })
      .build();

    const response = await Fetcher.get(
      apiPath,
      endpoint,
      url,
      GetWalletResponseResultSchema,
      deployEnv
    );

    return GetWalletResponseResult.fromJSON(response);
  };
};
