import {
  createLoadPresentationIdInvoker,
  createStorePresentationIdInvoker,
} from "../adapters/out/session/PresentationIdInMemory";
import { LoadPresentationId } from "../ports/out/session/LoadPresentationId";
import { StorePresentationId } from "../ports/out/session/StorePresentationId";
import { PortsOut } from "./PortsOut";

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
