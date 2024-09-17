import { LoadPresentationId } from "../ports/out/session/LoadPresentationId";
import { StorePresentationId } from "../ports/out/session/StorePresentationId";

export interface PortsOut {
  get storePresentationId(): StorePresentationId;
  get loadPresentationId(): LoadPresentationId;
}
