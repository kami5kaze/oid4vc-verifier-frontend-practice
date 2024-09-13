import { Hono } from 'hono';
import { initTransactionResponseSchema } from '../types/InitTransactionResponse';

const app = new Hono();

export const routes = app
  .get('/', (c) => c.text('Hello'))
  .post('/init', async (c) => {
    const res = await fetch(
      'https://oid4vc-verifier-endpoint-hono.g-trustedweb.workers.dev/ui/presentations',
      {
        method: 'POST',
        body: JSON.stringify({
          type: 'vp_token',
          presentation_definition: {
            id: '5db00636-73fb-425a-b5a3-482d26d0d602',
            input_descriptors: [
              {
                id: 'org.iso.18013.5.1.mDL',
                name: 'Mobile Driving Licence',
                purpose: 'We need to verify your mobile driving licence',
                format: { mso_mdoc: { alg: ['ES256', 'ES384', 'ES512'] } },
                constraints: {
                  fields: [
                    {
                      path: ["$['org.iso.18013.5.1']['given_name']"],
                      intent_to_retain: false,
                    },
                    {
                      path: ["$['org.iso.18013.5.1']['document_number']"],
                      intent_to_retain: false,
                    },
                  ],
                },
              },
            ],
          },
          nonce: '3b75b9b1-2463-4d4a-b921-adc21642c43c',
        }),
      }
    );
    const json = initTransactionResponseSchema.parse(await res.json());
    return c.json(json);
  });
