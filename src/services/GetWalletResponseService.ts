import { GetWalletResponseRequest } from '../domain/GetWalletResponseRequest';
import {
  GetWalletResponseResponse,
  GetWalletResponseResponseSchema,
} from '../domain/GetWalletResponseResponse';
import { GetWalletResponse } from '../ports/input/GetWalletResponse';
import { Fetcher } from '../utils/Fetcher';
import { QueryBuilder } from '../utils/QueryBuilder';
import { URLBuilder } from '../utils/URLBuilder';

export const createGetWalletResponseServiceInvoker = (
  baseUrl: string,
  apiPath: string
): GetWalletResponse => {
  return async (
    request: GetWalletResponseRequest,
    presentationId: string
  ): Promise<GetWalletResponseResponse> => {
    const url = new URLBuilder({
      baseUrl,
      path: apiPath,
      queryBuilder: new QueryBuilder({
        ...request.toJSON(),
      }),
    })
      .replacePathParams({ presentationId: presentationId })
      .build();

    const response = await Fetcher.get(url, GetWalletResponseResponseSchema);

    return GetWalletResponseResponse.fromJSON(response);
  };
};
