import { z } from "zod";

export const InitTransactionResponseSchema = z.object({
  presentation_id: z.string(),
  client_id: z.string(),
  request: z.string().optional(),
  request_uri: z.string().url().optional(),
});

export type InitTransactionResponseJSON = z.infer<
  typeof InitTransactionResponseSchema
>;

export type WalletRedirectParams = Omit<
  InitTransactionResponseJSON,
  "presentation_id"
>;

export class InitTransactionResponse {
  constructor(
    public readonly presentationId: string,
    public readonly clientId: string,
    public readonly request?: string,
    public readonly requestUri?: string
  ) {}

  static fromJSON(json: unknown): InitTransactionResponse {
    const parsed = InitTransactionResponseSchema.parse(json);
    return new InitTransactionResponse(
      parsed.presentation_id,
      parsed.client_id,
      parsed.request,
      parsed.request_uri
    );
  }

  toJSON(): InitTransactionResponseJSON {
    return {
      presentation_id: this.presentationId,
      client_id: this.clientId,
      request: this.request,
      request_uri: this.requestUri,
    };
  }

  toWalletRedirectParams(): WalletRedirectParams {
    return {
      client_id: this.clientId,
      request: this.request,
      request_uri: this.requestUri,
    };
  }
}
