import { assign, get, isArray, isObject, mapValues, omit } from "lodash";
import { JSONSchema7Value } from "../utils/helper-types";
import { REF_KEY } from "../constants";
import { JSONSchema7 } from "json-schema";

export const resolveRefs = (schema: JSONSchema7): JSONSchema7 => {
  const cache = new Map<string, JSONSchema7Value>();
  const resolve = <T extends JSONSchema7Value>(item: T): T => {
    if (!isObject(item)) return item;
    if (isArray(item)) return item.map(resolve) as T;
    const ref = item[REF_KEY] as string | undefined;
    if (!ref) return mapValues(item, resolve) as T;
    if (cache.has(ref)) return cache.get(ref) as T;

    const refVal = get(schema, refToPath(ref));
    if (!isObject(refVal)) return refVal;
    cache.set(ref, {});
    const resolvedValue = resolve(refVal);
    cache.set(ref, resolvedValue);
    return assign(mapValues(omit(item, REF_KEY), resolve) as T, resolvedValue);
  };
  return resolve(schema);
};

export const refToPath = (ref: string) =>
  ref.replace(/^#\/|\/+/g, ".").replace(/^\./, "");
