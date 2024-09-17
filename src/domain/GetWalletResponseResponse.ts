import { z } from 'zod';
import {
  PresentationSubmission,
  presentationSubmissionSchema,
} from 'oid4vc-prex';

export const GetWalletResponseResponseSchema = z.object({
  id_token: z.string().optional(),
  vp_token: z.string().optional(),
  presentation_submission: presentationSubmissionSchema.optional(),
  error: z.string().optional(),
  error_description: z.string().optional(),
});

export type GetWalletResponseResponseJSON = z.infer<
  typeof GetWalletResponseResponseSchema
>;

export class GetWalletResponseResponse {
  constructor(
    public readonly idToken?: string,
    public readonly vpToken?: string,
    public readonly presentationSubmission?: PresentationSubmission,
    public readonly error?: string,
    public readonly error_description?: string
  ) {}

  static fromJSON(json: unknown): GetWalletResponseResponse {
    const parsed = GetWalletResponseResponseSchema.parse(json);
    return new GetWalletResponseResponse(
      parsed.id_token,
      parsed.vp_token,
      parsed.presentation_submission
        ? PresentationSubmission.fromJSON(parsed.presentation_submission)
        : undefined,
      parsed.error,
      parsed.error
    );
  }

  toJSON(): GetWalletResponseResponseJSON {
    return {
      id_token: this.idToken,
      vp_token: this.vpToken,
      presentation_submission: this.presentationSubmission?.toJSON(),
      error: this.error,
      error_description: this.error_description,
    };
  }
}
