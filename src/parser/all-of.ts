import omit from "lodash/omit";
import mapValues from "lodash/mapValues";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";
import type { ExtractObjects, JSONSchema7Value } from "../utils/helper-types";
import { deepMerge } from "../utils/deep-merge";

export const allOf = <T extends JSONSchema7Value>(item: T): T =>
  !isObject(item)
    ? item
    : isArray(item)
    ? (item.map(allOf) as T)
    : (mapValues(
        isArray(item.allOf)
          ? deepMerge<ExtractObjects<JSONSchema7Value>>(
              ...(item.allOf.map(allOf) as ExtractObjects<JSONSchema7Value>[]),
              omit(item, "allOf")
            )
          : item,
        allOf
      ) as T);
