import { mDLDifinition } from './mDL';

export const presentationDefinition = (id: string) => ({
  id: id,
  input_descriptors: [mDLDifinition],
});
