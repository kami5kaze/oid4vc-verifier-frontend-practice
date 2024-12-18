import { Context } from 'hono';
import { Env } from '../env';
import { LoadPresentationId, StorePresentationId } from '../ports/out/session';
import { PortsOut } from './PortsOut';
import { PresentationIdDynamo } from '../adapters/out/session/PresentationIdDynamo';
import { DynamoDB } from 'oid4vc-core/dynamodb';
import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export const createDynamoDBClient = (config?: DynamoDBClientConfig) => {
  const client = new DynamoDBClient({
    endpoint: process.env.DYNAMODB_ENDPOINT,
    region: process.env.AWS_REGION,
    ...config,
  });
  return DynamoDBDocumentClient.from(client);
};

export class LambdaPortsOutImpl implements PortsOut {
  #presentationIdDynamo: PresentationIdDynamo;

  constructor(ctx: Context<Env>) {
    const client = createDynamoDBClient({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
      },
    });
    const dynamo = new DynamoDB(client, process.env.TABLE_NAME ?? '');
    this.#presentationIdDynamo = new PresentationIdDynamo(dynamo);
  }

  get storePresentationId(): StorePresentationId {
    return this.#presentationIdDynamo.storePresentationId;
  }

  get loadPresentationId(): LoadPresentationId {
    return this.#presentationIdDynamo.loadPresentationId;
  }
}
