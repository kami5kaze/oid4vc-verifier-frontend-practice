import { Context } from 'hono';
import { PresentationIdKVStore } from '../adapters/out/session/PresentationIdKVStore';
import { Env } from '../env';
import { LoadPresentationId, StorePresentationId } from '../ports/out/session';
import { PortsOut } from './PortsOut';

export class PortsOutImpl implements PortsOut {
  #presentationIdKVStore: PresentationIdKVStore;

  constructor(ctx: Context<Env>) {
    this.#presentationIdKVStore = new PresentationIdKVStore(
      ctx.env.PRESENTATION_ID_KV
    );
  }

  get storePresentationId(): StorePresentationId {
    return this.#presentationIdKVStore.storePresentationId;
  }

  get loadPresentationId(): LoadPresentationId {
    return this.#presentationIdKVStore.loadPresentationId;
  }
}
