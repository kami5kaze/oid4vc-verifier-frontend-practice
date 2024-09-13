import { z } from "zod";

/**
 * Zod schema for InitTransactionResponse
 */
export const initTransactionResponseSchema = z.object({
  presentation_id: z.string(),
  client_id: z.string(),
  request: z.string().optional(),
  request_uri: z.string().url().optional(),
});

/**
 * Type representing the JSON object of InitTransactionResponse
 */
export type InitTransactionResponseJSON = z.infer<
  typeof initTransactionResponseSchema
>;

/**
 * Type representing the JSON object of WalletRedirectParams
 */
export type WalletRedirectParamsJSON = Omit<
  InitTransactionResponseJSON,
  "presentation_id"
>;

/**
 * Represents the response from the Initiate Transaction endpoint
 * @class
 * @property {string} presentationId - The presentation ID
 * @property {string} clientId - The client ID
 * @property {string} [request] - The request
 * @property {string} [requestUri] - The request URI
 */
export class InitTransactionResponse {
  /**
   * Constructor for InitTransactionResponse
   * @property {string} presentationId - The presentation ID
   * @property {string} clientId - The client ID
   * @property {string} [request] - The request
   * @property {string} [requestUri] - The request URI
   */
  private constructor(
    public readonly presentationId: string,
    public readonly clientId: string,
    public readonly request?: string,
    public readonly requestUri?: string
  ) {}

  /**
   * Creates an instance of InitTransactionResponse from a Response object
   * @param {Response} res - The response object
   * @returns {Promise<InitTransactionResponse>} A promise that resolves with an instance of InitTransactionResponse
   * @throws {z.ZodError} If validation fails
   */
  static async fromResponse(res: Response): Promise<InitTransactionResponse> {
    const json = await res.json();
    return this.fromJSON(json);
  }

  /**
   * Creates an instance of InitTransactionResponse from a JSON object
   * @param {unknown} json - The JSON object
   * @returns {InitTransactionResponse} An instance of InitTransactionResponse
   * @throws {z.ZodError} If validation fails
   */
  static fromJSON(json: unknown): InitTransactionResponse {
    const result = initTransactionResponseSchema.parse(json);

    return new InitTransactionResponse(
      result.presentation_id,
      result.client_id,
      result.request,
      result.request_uri
    );
  }

  /**
   * Converts an instance of InitTransactionResponse to a JSON object
   * @returns {InitTransactionResponseJSON} An instance of InitTransactionResponse as a JSON object
   */
  toJSON(): InitTransactionResponseJSON {
    return {
      presentation_id: this.presentationId,
      client_id: this.clientId,
      request: this.request,
      request_uri: this.requestUri,
    };
  }

  /**
   * Converts an instance of InitTransactionResponse to a WalletRedirectParamsJSON object
   * @returns {WalletRedirectParamsJSON} An instance of InitTransactionResponse as a WalletRedirectParamsJSON object
   */
  toWalletRedirectParams(): WalletRedirectParamsJSON {
    return {
      client_id: this.clientId,
      request: this.request,
      request_uri: this.requestUri,
    };
  }
}
