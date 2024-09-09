import { isArray } from "lodash";
import mergeWith from "lodash/mergeWith";
import { ExtractArrays, ValueOf } from "./helper-types";

export const deepMerge = <T extends object>(...args: Partial<T>[]) =>
  mergeWith({}, ...args, (objValue: ValueOf<T>, srcValue: ValueOf<T>) =>
    isArray(objValue)
      ? (objValue as ExtractArrays<T>).concat(srcValue)
      : undefined
  ) as T;
