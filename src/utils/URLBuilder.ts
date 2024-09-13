import { z } from 'zod';

export const paramsSchema = z.record(z.string(), z.unknown());
const urlSchema = z.string().url();

export type ParamsType = z.infer<typeof paramsSchema>;

/**
 * URLBuilder class
 * @class
 * @property {string} url - The URL
 * @property {ParamsType} params - The query parameters
 */
export class URLBuilder {
  /**
   * Constructor for URLBuilder.GET
   * @param {string} url - The URL
   * @param {ParamsType} params - The query parameters
   */
  constructor(
    private readonly url: string,
    private readonly params: ParamsType = {}
  ) {
    paramsSchema.parse(params);
  }

  /**
   * Build the URL
   * @returns {string} - The URL
   * @throws {z.ZodError} - If the URL is invalid
   */
  build(): string {
    const url = new URL(this.url);

    Object.entries(this.params).forEach(([key, value]) => {
      !!value && url.searchParams.append(key, String(value));
    });

    return urlSchema.parse(url.toString());
  }
}
