export interface Bindings {
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
