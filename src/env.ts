export interface Bindings {
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  TABLE_NAME: string;
  API_BASE_URL: string;
  INIT_TRANSACTION_PATH: string;
  WALLET_RESPONSE_PATH: string;
  WALLET_URL: string;
  PUBLCI_URL: string;
  PRESENTATION_ID_KV: KVNamespace;
  BACKEND: Service;
  [key: string]: unknown;
}

export interface Env {
  Bindings: Bindings;
}
