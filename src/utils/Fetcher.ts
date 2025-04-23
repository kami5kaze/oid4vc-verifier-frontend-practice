import { z } from 'zod';
import {
  LambdaClient,
  InvokeCommand,
  InvocationType,
  LogType,
} from '@aws-sdk/client-lambda';
import { LambdaEvent } from 'hono/aws-lambda';
import { RequestContext } from 'hono/jsx-renderer';

export class Fetcher {
  static async get<T>(
    apiPath: string,
    endpoint: Service,
    url: string,
    schema: z.ZodSchema<T>,
    deployEnv: string
  ): Promise<T> {
    const response = await this.fetch(apiPath, endpoint, url, 'GET', deployEnv);
    this.checkStatus(response);
    const data = await response.json();
    return schema.parse(data);
  }

  static async post<T>(
    apiPath: string,
    endpoint: Service,
    url: string,
    body: string,
    schema: z.ZodSchema<T>,
    deployEnv: string
  ): Promise<T> {
    const response = await this.fetch(
      apiPath,
      endpoint,
      url,
      'POST',
      deployEnv,
      body
    );
    this.checkStatus(response);
    const data = await response.json();
    return schema.parse(data);
  }

  private static async fetch(
    apiPath: string,
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
      return fetch(request);
      // const lambdaClient = new LambdaClient({ region: 'ap-northeast-1' });
      // const payload: LambdaEvent = {
      //   version: '1.0',
      //   httpMethod: method,
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   path: apiPath,
      //   body: body ?? null,
      //   isBase64Encoded: false,
      //   requestContext: {
      //     accountId: '577638367706',
      //     apiId: 'vaisz5z1ab',
      //     authorizer: {
      //       claims: null,
      //       scopes: null,
      //     },
      //     domainName: 'id.execute-api.ap-northeast-1.amazonaws.com',
      //     domainPrefix: 'id',
      //     extendedRequestId: 'request-id',
      //     httpMethod: method,
      //     identity: {
      //       sourceIp: 'IP',
      //       userAgent: 'user-agent',
      //     },
      //     path: apiPath,
      //     protocol: 'HTTP/1.1',
      //     requestId: 'id=',
      //     requestTime: 'request-time',
      //     requestTimeEpoch: 1428582896000,
      //     resourcePath: apiPath,
      //     stage: 'dev',
      //   },
      //   resource: apiPath,
      // };

      // const params = {
      //   FunctionName: 'verifier-endpoint',
      //   InvocationType: InvocationType.RequestResponse,
      //   LogType: LogType.Tail,
      //   Payload: JSON.stringify({
      //     ...payload,
      //   }),
      // };

      // const command = new InvokeCommand(params);
      // const response = await lambdaClient.send(command);

      // if (response.StatusCode == 200) {

      //   // return await fetch(request);
      // } else {
      //   throw new Error('No payload received from Lambda function');
      // }
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
