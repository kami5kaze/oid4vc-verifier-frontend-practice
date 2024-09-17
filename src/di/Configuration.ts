export interface Configuration {
  get baseUrl(): string;
  get initTransactionPath(): string;
  get getWalletResponsePath(): string;
  get homePath(): string;
  get initPath(): string;
  get resultPath(): string;
}
