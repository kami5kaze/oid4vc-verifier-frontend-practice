import { z } from "zod";

export class Fetcher {
  static async get<T>(url: string, schema: z.ZodSchema<T>): Promise<T> {
    const response = await fetch(url);
    this.checkStatus(response);
    const data = await response.json();
    return schema.parse(data);
  }

  static async post<T>(
    url: string,
    body: string,
    schema: z.ZodSchema<T>
  ): Promise<T> {
    const response = await fetch(url, {
      method: "POST",
      body: body,
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.checkStatus(response);
    const data = await response.json();
    return schema.parse(data);
  }

  private static checkStatus(response: Response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    const message = `Status: ${response.status}, Message: ${response.statusText}`;
    console.error(message);
    throw new Error(message);
  }
}
