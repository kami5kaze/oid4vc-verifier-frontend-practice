import { z } from 'zod';

export class Fetcher {
  static async get<T>(
    endpoint: Service,
    url: string,
    schema: z.ZodSchema<T>,
    deployEnv: 'cloudflare' | 'lambda' | 'local'
  ): Promise<T> {
    const response = await this.fetch(endpoint, url, 'GET', deployEnv);
    this.checkStatus(response);
    const data = await response.json();
    return schema.parse(data);
  }

  static async post<T>(
    endpoint: Service,
    url: string,
    body: string,
    schema: z.ZodSchema<T>,
    deployEnv: 'cloudflare' | 'lambda' | 'local'
  ): Promise<T> {
    const response = await this.fetch(endpoint, url, 'POST', deployEnv, body);
    this.checkStatus(response);
    const data = await response.json();
    return schema.parse(data);
  }

  private static async fetch(
    endpoint: Service,
    url: string,
    method: string,
    deployEnv: 'cloudflare' | 'lambda' | 'local',
    body?: string
  ): Promise<Response> {
    const request = new Request(url, {
      method: method,
      body: body,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    try {
      console.log(
        `Fetcher: executing ${method} request to ${url} in ${deployEnv} environment`
      );

      if (deployEnv === 'cloudflare') {
        return endpoint.fetch(request);
      } else {
        // 非Cloudflare環境での詳細なエラー処理
        try {
          // URLが有効かチェック
          new URL(url);

          // グローバルfetchを使用
          return await fetch(request);
        } catch (err) {
          if (err instanceof TypeError && err.message.includes('Invalid URL')) {
            console.error(`Invalid URL: ${url}`, err);
            throw new Error(`Invalid URL format: ${url}`);
          } else {
            console.error(`Fetch error in ${deployEnv} environment:`, err);

            // より詳細なエラー情報を提供
            if (err instanceof Error) {
              throw new Error(
                `Fetch in ${deployEnv} failed: ${err.name} - ${err.message}`
              );
            }
            throw err;
          }
        }
      }
    } catch (error) {
      console.error(`Fetch operation failed:`, error);
      throw error;
    }
  }

  private static checkStatus(response: Response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    const message = `Status: ${response.status}, Message: ${response.statusText}`;
    console.error(message);
    throw new Error(message);
  }
}
