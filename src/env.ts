export interface Bindings {
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  TABLE_NAME: string;
  API_BASE_URL_VERIFIER_FRONTEND: string;
  INIT_TRANSACTION_PATH: string;
  WALLET_RESPONSE_PATH: string;
  WALLET_URL: string;
  PUBLIC_URL_VERIFIER_FRONTEND: string;
  PRESENTATION_ID_KV: KVNamespace;
  BACKEND: Service;
  [key: string]: unknown;
  DEPLOY_ENV: 'cloudflare' | 'lambda' | 'local';
  SWITCHBOT_API_URL: string;
  SWITCHBOT_API_TOKEN: string; 
  SWITCHBOT_API_SECRET: string;
  HMAC_KEY: string;
  ALGORITHM1: string;
  ALGORITHM2: string;
  ALGORITHM3: string;
}

export interface Env {
  Bindings: Bindings;
}
