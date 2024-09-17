import { z } from "zod";

export const SameDeviceRequestSchema = z.object({
  __type: z.literal("same_device"),
  response_code: z.string(),
});

export const CrossDeviceRequestSchema = z.object({
  __type: z.literal("cross_device"),
  response_code: z.undefined(),
});

export const GetWalletResponseRequestSchema = z.discriminatedUnion("__type", [
  SameDeviceRequestSchema,
  CrossDeviceRequestSchema,
]);

export type GetWalletResponseRequestJSON = Omit<
  z.infer<typeof GetWalletResponseRequestSchema>,
  "__type"
>;

export class GetWalletResponseRequest {
  constructor(
    private readonly __type: "same_device" | "cross_device",
    private readonly responseCode?: string
  ) {}

  static fromJSON(json: unknown): GetWalletResponseRequest {
    const parsed = GetWalletResponseRequestSchema.parse(json);
    return new GetWalletResponseRequest(parsed.__type, parsed.response_code);
  }

  get type(): "same_device" | "cross_device" {
    return this.__type;
  }

  toJSON(): GetWalletResponseRequestJSON {
    return {
      response_code: this.responseCode,
    };
  }
}
