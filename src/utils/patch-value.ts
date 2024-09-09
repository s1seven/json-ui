import { set } from "lodash";

export const patchValue = (original: any, path: string, patch: any) => {
  const cln = structuredClone(original);
  set(cln, path, patch);
  return cln;
};
