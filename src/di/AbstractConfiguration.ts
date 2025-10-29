import { Configuration } from './Configuration';

/**
 * Abstract class that implements the Configuration interface
 * @implements {Configuration}
 */
export abstract class AbstractConfiguration implements Configuration {
  abstract get apiBaseUrl(): string;
  abstract get initTransactionPath(): string;
  abstract get getWalletResponsePath(): string;
  abstract get publicUrl(): string;
  abstract get walletUrl(): string;
  abstract get deployEnv(): string;
  abstract get switchbotapiUrl(): string;
  abstract get switchbotapiToken(): string;
  abstract get switchbotapiSecret(): string;
  abstract get hmacKey(): string;
  abstract get algorithm1(): string;
  abstract get algorithm2(): string;
  abstract get algorithm3(): string;  

  get homePath(): string {
    return '/home';
  }
  get initPath(): string {
    return '/init';
  }
  get resultPath(): string {
    return '/result';
  }

  get switchbotPath(): string {
    return '/switchbot';
  }

  get controllerPath(): string {
    return '/control';
  }
}
