import { z } from 'zod';
import { Fetcher } from './Fetcher';
import { URLBuilder } from './URLBuilder';

describe('Fetcher', () => {
  const mockUrl = 'https://api.example.com/';
  const mockSchema = z.object({ name: z.string() });
  const mockResponse = { name: 'example' };

  describe('get', () => {
    it('should fetch data with GET method', async () => {
      const urlBuilder = new URLBuilder({ baseUrl: mockUrl });
      const mockEndpoint: Service = {
        fetch: vi.fn().mockResolvedValue(
          new Response(JSON.stringify({
            name: 'example'
          }), {
            headers: new Headers({ 'Content-Type': 'application/json' }),
            status: 200,
          })
        ),
        connect: vi.fn(),
      };
      const data = await Fetcher.get(
        mockEndpoint,
        urlBuilder.build(),
        mockSchema
      );

      expect(data).toEqual(mockResponse);
    });

    it('should throw an error on failure with GET method', async () => {
      const urlBuilder = new URLBuilder({ baseUrl: mockUrl });
      const mockEndpoint: Service = {
        fetch: vi.fn().mockResolvedValue(
          new Response(JSON.stringify({
            error: 'Bad Request'
          }), {
            headers: new Headers({ 'Content-Type': 'application/json' }),
            status: 400,
            statusText: 'Bad Request'
          })
        ),
        connect: vi.fn(),
      };
      await expect(Fetcher.get(
        mockEndpoint,
        urlBuilder.build(),
        mockSchema
      )).rejects.toThrow('Status: 400, Message: Bad Request');
    });
  });

  describe('post', () => {
    it('should post JSON data', async () => {
      const urlBuilder = new URLBuilder({ baseUrl: mockUrl });
      const body = JSON.stringify({ key: 'value' });
      const mockEndpoint: Service = {
        fetch: vi.fn().mockResolvedValue(
          new Response(JSON.stringify({
            name: 'example'
          }), {
            headers: new Headers({ 'Content-Type': 'application/json' }),
            status: 200,
          })
        ),
        connect: vi.fn(),
      };

      const data = await Fetcher.post(
        mockEndpoint,
        urlBuilder.build(),
        body,
        mockSchema
      );

      expect(data).toEqual(mockResponse);
    });
  });

  it('should throw an error on failure with POST method', async () => {
    const urlBuilder = new URLBuilder({ baseUrl: mockUrl });
    const body = JSON.stringify({ key: 'value' });
    const mockEndpoint: Service = {
      fetch: vi.fn().mockResolvedValue(
        new Response(JSON.stringify({
          error: 'Bad Request'
        }), {
          headers: new Headers({ 'Content-Type': 'application/json' }),
          status: 400,
          statusText: 'Bad Request'
        })
      ),
      connect: vi.fn(),
    };
    await expect(Fetcher.post(
      mockEndpoint,
      urlBuilder.build(),
      body,
      mockSchema
    )).rejects.toThrow('Status: 400, Message: Bad Request');
  });
});
