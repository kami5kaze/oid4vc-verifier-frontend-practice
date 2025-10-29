/**
 * Configuration interface
 */
export interface Configuration {
  /**
   * The base url of the api
   */
  get apiBaseUrl(): string;
  /**
   * The api path of the init transaction
   */
  get initTransactionPath(): string;
  /**
   * The api path of the get wallet response
   */
  get getWalletResponsePath(): string;
  /**
   * The public url of frontend
   */
  get publicUrl(): string;
  /**
   * The home path of frontend
   */
  get homePath(): string;
  /**
   * The init path of frontend
   */
  get initPath(): string;
  /**
   * The result path of frontend
   */
  get resultPath(): string;
  /**
   * The switchbot path of frontend
   */
  get switchbotPath(): string;
  /**
   * The switchbot controller path 
   */
  get controllerPath(): string;
  /**
   * The wallet deep link
   */
  get walletUrl(): string;
  /**
   * The switchbot api url
   */
  get switchbotapiUrl(): string;
  
  get switchbotapiToken(): string;

  get switchbotapiSecret(): string;

  get hmacKey(): string;

  get algorithm1(): string;

  get algorithm2(): string;

  get algorithm3(): string;

  get deployEnv(): string;
}
