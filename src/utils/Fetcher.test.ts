import { z } from 'zod';
import { Fetcher } from './Fetcher';
import { URLBuilder } from './URLBuilder';

describe('Fetcher', () => {
  const mockUrl = 'https://api.example.com/';
  const mockSchema = z.object({ name: z.string() });
  const mockResponse = { name: 'example' };

  beforeEach(() => {
    // @ts-ignore
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers({ 'Content-Type': 'application/json' }),
        status: 200,
      })
    ) as unknown as typeof fetch;
  });
  describe('get', () => {
    it('should fetch data with GET method', async () => {
      const urlBuilder = new URLBuilder({ baseUrl: mockUrl });
      const data = await Fetcher.get(urlBuilder.build(), mockSchema);

      expect(data).toEqual(mockResponse);
    });
  });

  describe('post', () => {
    it('should post JSON data', async () => {
      const urlBuilder = new URLBuilder({ baseUrl: mockUrl });
      const body = JSON.stringify({ key: 'value' });

      const data = await Fetcher.post(urlBuilder.build(), body, mockSchema);

      expect(data).toEqual(mockResponse);
    });
  });
});
