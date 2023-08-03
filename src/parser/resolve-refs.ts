import {
  assign,
  get,
  isArray,
  isObject,
  isString,
  mapValues,
  omit,
} from "lodash";
import { JSONSchema7Value } from "../utils/helper-types";
import { REF_KEY } from "../constants";
import { JSONSchema7 } from "json-schema";

export const resolveRefs = (schema: JSONSchema7): JSONSchema7 => {
  const resolve = <T extends JSONSchema7Value>(item: T): T =>
    !isObject(item)
      ? item
      : isArray(item)
      ? (item.map(resolve) as T)
      : (mapValues(
          assign(
            omit(item, REF_KEY),
            isString(item[REF_KEY]) ? get(schema, refToPath(item[REF_KEY])) : {}
          ),
          resolve
        ) as T);
  return resolve(schema);
};

export const refToPath = (ref: string) =>
  ref.replace(/^#\/|\/+/g, ".").replace(/^\./, "");
