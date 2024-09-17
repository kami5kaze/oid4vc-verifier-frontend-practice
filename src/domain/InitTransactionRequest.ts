import { z } from 'zod';
import {
  presentationDefinitionSchema,
  PresentationDefinition,
} from 'oid4vc-prex';

export const presentationTypeSchema = z.enum([
  'id_token',
  'vp_token',
  'id_token vp_token',
]);
export const responseModeSchema = z.enum(['direct_post', 'direct_post.jwt']);
export const jarModeSchema = z.enum(['by_value', 'by_reference']);
export const presentationDefinitionModeSchema = z.enum([
  'by_value',
  'by_reference',
]);

export const InitRequestRequestSchema = z.object({
  type: presentationTypeSchema,
  presentation_definition: presentationDefinitionSchema,
  nonce: z.string().optional(),
  response_mode: responseModeSchema.optional(),
  jar_mode: jarModeSchema.optional(),
  presentation_definition_mode: presentationDefinitionModeSchema.optional(),
  wallet_response_redirect_uri_template: z.string().optional(),
});

export type PresentationType = z.infer<typeof presentationTypeSchema>;
export type ResponseMode = z.infer<typeof responseModeSchema>;
export type JarMode = z.infer<typeof jarModeSchema>;
export type PresentationDefinitionMode = z.infer<
  typeof presentationDefinitionModeSchema
>;
export type InitRequestRequestJSON = z.infer<typeof InitRequestRequestSchema>;

export class InitTransactionRequest {
  constructor(
    public readonly type: PresentationType,
    public readonly presentationDefinition: PresentationDefinition,
    public readonly nonce?: string,
    public readonly responseMode?: ResponseMode,
    public readonly jarMode?: JarMode,
    public readonly presentationDefinitionMode?: PresentationDefinitionMode,
    public readonly walletResponseRedirectUriTemplate?: string
  ) {}

  static fromJSON(json: unknown): InitTransactionRequest {
    const parsed = InitRequestRequestSchema.parse(json);
    return new InitTransactionRequest(
      parsed.type,
      PresentationDefinition.fromJSON(parsed.presentation_definition),
      parsed.nonce,
      parsed.response_mode,
      parsed.jar_mode,
      parsed.presentation_definition_mode,
      parsed.wallet_response_redirect_uri_template
    );
  }

  toJSON(): InitRequestRequestJSON {
    return {
      type: this.type,
      presentation_definition: this.presentationDefinition.toJSON(),
      nonce: this.nonce,
      response_mode: this.responseMode,
      jar_mode: this.jarMode,
      presentation_definition_mode: this.presentationDefinitionMode,
      wallet_response_redirect_uri_template:
        this.walletResponseRedirectUriTemplate,
    };
  }
}
