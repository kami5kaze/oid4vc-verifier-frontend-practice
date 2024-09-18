import {
  createLoadPresentationIdInvoker,
  createStorePresentationIdInvoker,
} from '../adapters/out/session';
import { LoadPresentationId, StorePresentationId } from '../ports/out/session';
import { PortsOut } from './PortsOut';

export class PortsOutImpl implements PortsOut {
  #storePresentationId: StorePresentationId =
    createStorePresentationIdInvoker();
  #loadPresentationId: LoadPresentationId = createLoadPresentationIdInvoker();

  get storePresentationId(): StorePresentationId {
    return this.#storePresentationId;
  }

  get loadPresentationId(): LoadPresentationId {
    return this.#loadPresentationId;
  }
}
