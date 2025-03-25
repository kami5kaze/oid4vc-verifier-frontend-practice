import { createMiddleware } from 'hono/factory';
import { env } from 'hono/adapter';
import { Env } from '../env';
import * as Aws from 'aws-sdk'

async function getSecret(secretName: string, region: string, endpoint?: string): Promise<void> {
    const client = new Aws.SecretsManager({
        region,
        endpoint
    });

    try {
        const data = await client.getSecretValue({ SecretId: secretName }).promise();

        if ('SecretString' in data) {
            const secret = data.SecretString;
            const secretObj = JSON.parse(secret!);

            for (const [key, value] of Object.entries(secretObj)) {
                process.env[key] = value as string;
            }
        }
    } catch (err) {
        console.error(`Error retrieving secret: ${err}`);
    }
}

export const setupLambdaMiddleware = createMiddleware(async (c, next) => {
    const deployEnv = process.env.DEPLOY_ENV || 'aws';
    const secretName = "twEnviromentVariables";
    const region = "ap-northeast-1";
    const endpoint = deployEnv === 'local' ? 'http://localhost:4566' : undefined;

    await getSecret(secretName, region, endpoint);

    c.env = {
        ...c.env,
        API_BASE_URL: process.env.API_BASE_URL,
        INIT_TRANSACTION_PATH: process.env.INIT_TRANSACTION_PATH,
        GET_WALLET_RESPONSE_PATH: process.env.GET_WALLET_RESPONSE_PATH,
        WALLET_URL: process.env.WALLET_URL,
        WALLET_RESPONSE_PATH: process.env.WALLET_RESPONSE_PATH,
        PUBLCI_URL: process.env.PUBLCI_URL || '',
        DYNAMODB_TABLE: process.env.DYNAMODB_TABLE_VERIFIER_FRONTEND || '',
    };
    return next();
});