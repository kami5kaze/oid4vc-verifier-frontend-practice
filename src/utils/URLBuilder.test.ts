import { URLBuilder } from "./URLBuilder";

describe("URLBuilder", () => {
  describe("constructor", () => {
    it("should return an instance of URLBuilder with query params", () => {
      const url = new URLBuilder("https://example.com", { foo: "bar" });
      expect(url).toBeInstanceOf(URLBuilder);
    });
    it("should return an instance of URLBuilder without query params", () => {
      const url = new URLBuilder("https://example.com");
      expect(url).toBeInstanceOf(URLBuilder);
    });
    it("should throw an error if the params are invalid", () => {
      expect(
        () => new URLBuilder("https://example.com", "bar" as any)
      ).toThrow();
    });
  });
  describe("build", () => {
    it("should return a valid URL with query params", () => {
      const url = new URLBuilder(
        "eudi-openid4vp://verifier-backend.eudiw.dev",
        { foo: "bar" }
      );
      expect(url.build()).toBe(
        "eudi-openid4vp://verifier-backend.eudiw.dev?foo=bar"
      );
    });
    it("should return a valid URL without query params", () => {
      const url = new URLBuilder(
        "eudi-openid4vp://verifier-backend.eudiw.dev",
        {}
      );
      expect(url.build()).toBe("eudi-openid4vp://verifier-backend.eudiw.dev");
    });
  });
});
