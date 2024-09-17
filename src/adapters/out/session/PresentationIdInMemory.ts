import { LoadPresentationId } from "../../../ports/out/session/LoadPresentationId";
import { StorePresentationId } from "../../../ports/out/session/StorePresentationId";

export class SessionInMemory {
  private sessions: Map<string, string> = new Map();

  storePresentationId: StorePresentationId = async (
    sessionId,
    presentationId
  ) => {
    this.sessions.set(sessionId, presentationId);
  };

  loadPresentationId: LoadPresentationId = async (sessionId) => {
    return this.sessions.get(sessionId);
  };
}

const store = new SessionInMemory();

export const createLoadPresentationIdInvoker = (): LoadPresentationId => {
  return store.loadPresentationId;
};

export const createStorePresentationIdInvoker = (): StorePresentationId => {
  return store.storePresentationId;
};
