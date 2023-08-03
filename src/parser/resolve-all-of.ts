import omit from "lodash/omit";
import mapValues from "lodash/mapValues";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";
import type { ExtractObjects, JSONSchema7Value } from "../utils/helper-types";
import { deepMerge } from "../utils/deep-merge";

export const resolveAllOf = <T extends JSONSchema7Value>(item: T): T =>
  !isObject(item)
    ? item
    : isArray(item)
    ? (item.map(resolveAllOf) as T)
    : (mapValues(
        isArray(item.allOf)
          ? deepMerge<ExtractObjects<JSONSchema7Value>>(
              ...(item.allOf.map(
                resolveAllOf
              ) as ExtractObjects<JSONSchema7Value>[]),
              omit(item, "allOf")
            )
          : item,
        resolveAllOf
      ) as T);
