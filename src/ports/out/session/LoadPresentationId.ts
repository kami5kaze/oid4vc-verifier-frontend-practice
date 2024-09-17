export interface LoadPresentationId {
  (sessionId: string): Promise<string | undefined>;
}
