import { z } from "zod";

export const GetWalletResponseResponseSchema = z.record(
  z.string(),
  z.unknown()
);

export type GetWalletResponseResponseJSON = z.infer<
  typeof GetWalletResponseResponseSchema
>;

export class GetWalletResponseResponse {
  constructor(private readonly response: GetWalletResponseResponseJSON) {}

  static fromJSON(json: unknown): GetWalletResponseResponse {
    const parsed = GetWalletResponseResponseSchema.parse(json);
    return new GetWalletResponseResponse(parsed);
  }

  toJSON(): GetWalletResponseResponseJSON {
    return this.response;
  }
}
