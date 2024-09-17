import { InitTransactionRequest } from "../domain/InitTransactionRequest";
import { createInitTransactionServiceInvoker } from "./InitTransactionService";
import { describe, it, expect } from "vitest";

const apiBaseUrl = "https://dev.verifier-backend.eudiw.dev";
const apiPath = "/ui/presentations";

describe("InitTransactionService", () => {
  describe("invoke init Transaction", () => {
    it("should return a transaction object", async () => {
      const invoker = createInitTransactionServiceInvoker(apiBaseUrl, apiPath);
      const request = new InitTransactionRequest();
      const transaction = await invoker(request);
      console.log("transaction :>> ", transaction);
      expect(transaction).toBeDefined();
    });
  });
});
