import { z } from 'zod';
import {
  LambdaClient,
  InvokeCommand,
  InvocationType,
} from '@aws-sdk/client-lambda';

export class Fetcher {
  static async get<T>(
    endpoint: Service,
    url: string,
    schema: z.ZodSchema<T>,
    deployEnv: string
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
    deployEnv: string
  ): Promise<T> {
    const response = await this.fetch(endpoint, url, 'POST', body, deployEnv);
    this.checkStatus(response);
    const data = await response.json();
    return schema.parse(data);
  }

  private static async fetch(
    endpoint: Service,
    url: string,
    method: string,
    deployEnv: string,
    body?: string
  ): Promise<Response> {
    const request = new Request(url, {
      method: method,
      body: body,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const environment = this.getEnv(deployEnv);
    if (environment === 'cloudflare') {
      return endpoint.fetch(request);
    } else {
      const lambdaClient = new LambdaClient({ region: 'ap-northeast-1' });
      const params = {
        FunctionName: 'verifier-endpoint',
        InvocationType: InvocationType.RequestResponse,
        Payload: new TextEncoder().encode(
          JSON.stringify({
            url: url,
            method: method,
            body: body,
          })
        ),
      };
      const command = new InvokeCommand(params);
      const response = await lambdaClient.send(command);

      if (!response.FunctionError) {
        return await fetch(url);
      } else {
        throw new Error('No payload received from Lambda function');
      }
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

  private static getEnv(env: string): 'aws' | 'cloudflare' {
    if (env === 'aws') {
      return 'aws';
    } else {
      return 'cloudflare';
    }
  }
}
