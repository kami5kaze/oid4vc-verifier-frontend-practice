import {
  InitTransactionResponse,
  InitTransactionResponseJSON,
} from "./InitTransactionResponse";

describe("InitTransactionResponse", () => {
  describe("fromResponse", () => {
    it("should return an instance of InitTransactionResponse", async () => {
      const res = new Response(
        JSON.stringify({
          presentation_id: "presentation_id",
          client_id: "client_id",
          request: "request",
          request_uri: "https://example.com",
        })
      );
      const instance = await InitTransactionResponse.fromResponse(res);
      expect(instance).toBeInstanceOf(InitTransactionResponse);
      expect(instance.presentationId).toBe("presentation_id");
      expect(instance.clientId).toBe("client_id");
      expect(instance.request).toBe("request");
      expect(instance.requestUri).toBe("https://example.com");
    });
  });
  describe("fromJSON", () => {
    it("should return an instance of InitTransactionResponse", () => {
      const json = {
        presentation_id: "presentation_id",
        client_id: "client_id",
        request: "request",
        request_uri: "https://example.com",
      };
      const instance = InitTransactionResponse.fromJSON(json);
      expect(instance).toBeInstanceOf(InitTransactionResponse);
      expect(instance.presentationId).toBe("presentation_id");
      expect(instance.clientId).toBe("client_id");
      expect(instance.request).toBe("request");
      expect(instance.requestUri).toBe("https://example.com");
    });
  });
  describe("toJSON", () => {
    it("should return an object with the properties of InitTransactionResponse", () => {
      const json = {
        presentation_id: "presentation_id",
        client_id: "client_id",
        request: "request",
        request_uri: "https://example.com",
      };
      const instance = InitTransactionResponse.fromJSON(json);
      expect(json).toEqual(instance.toJSON());
    });
  });
  describe("toWalletRedirectParams", () => {
    it("should return an object with the properties of InitTransactionResponse", () => {
      const json: Partial<InitTransactionResponseJSON> = {
        presentation_id: "presentation_id",
        client_id: "client_id",
        request: "request",
        request_uri: "https://example.com",
      };
      const instance = InitTransactionResponse.fromJSON(json);
      delete json.presentation_id;
      expect(json).toEqual(instance.toWalletRedirectParams());
    });
  });
});
