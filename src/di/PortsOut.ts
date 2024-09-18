import { LoadPresentationId, StorePresentationId } from '../ports/out/session';

export interface PortsOut {
  get storePresentationId(): StorePresentationId;
  get loadPresentationId(): LoadPresentationId;
}
