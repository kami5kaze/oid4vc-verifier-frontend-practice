import { Context } from 'hono';
import { LoadPresentationId, StorePresentationId } from '../ports/out/session';
import { PortsOut } from './PortsOut';
import { PresentationIdDynamo } from '../adapters/out/session/PresentationIdDynamo';
import { DynamoDB } from 'oid4vc-core/dynamodb';
import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { env } from 'hono/adapter';
import { Bindings } from '../env';

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

  constructor(ctx: Context) {
    const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, TABLE_NAME } =
      env<Bindings>(ctx);
    const client = createDynamoDBClient({
      // credentials: {
      //   accessKeyId: AWS_ACCESS_KEY_ID,
      //   secretAccessKey: AWS_SECRET_ACCESS_KEY,
      // },
    });
    const dynamo = new DynamoDB(client, TABLE_NAME);
    this.#presentationIdDynamo = new PresentationIdDynamo(dynamo);
  }

  get storePresentationId(): StorePresentationId {
    return this.#presentationIdDynamo.storePresentationId;
  }

  get loadPresentationId(): LoadPresentationId {
    return this.#presentationIdDynamo.loadPresentationId;
  }
}
