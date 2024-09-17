import { z } from 'zod';

export const GetWalletResponseRequestSchema = z.object({
  response_code: z.string().optional(),
});

export type GetWalletResponseRequestJSON = z.infer<
  typeof GetWalletResponseRequestSchema
>;

export class GetWalletResponseRequest {
  constructor(public readonly responseCode?: string) {}

  static fromJSON(json: unknown): GetWalletResponseRequest {
    const parsed = GetWalletResponseRequestSchema.parse(json);
    return new GetWalletResponseRequest(parsed.response_code);
  }

  toJSON(): GetWalletResponseRequestJSON {
    return {
      response_code: this.responseCode,
    };
  }
}
