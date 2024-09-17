export interface StorePresentationId {
  (sessionId: string, presentationId: string): Promise<void>;
}
