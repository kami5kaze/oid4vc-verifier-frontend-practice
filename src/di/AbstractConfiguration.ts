import { Configuration } from "./Configuration";

export abstract class AbstractConfiguration implements Configuration {
  abstract get baseUrl(): string;
  abstract get initTransactionPath(): string;
  abstract get getWalletResponsePath(): string;
  get homePath(): string {
    return "/home";
  }
  get initPath(): string {
    return "/init";
  }
  get resultPath(): string {
    return "/result";
  }
}
