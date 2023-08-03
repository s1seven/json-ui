import { isObject, isArray, omit } from "lodash";
import { deepMerge } from "../utils/deep-merge";
import { JSONSchema7Value, ExtractObjects } from "../utils/helper-types";

export const anyOf = (item: JSONSchema7Value, indices: number[]) => {
  if (!isObject(item) || isArray(item) || !isArray(item.anyOf)) return item;
  const { anyOf } = item;
  return deepMerge<ExtractObjects<JSONSchema7Value>>(
    ...indices.map((idx) => anyOf[idx] as ExtractObjects<JSONSchema7Value>),
    omit(item, "anyOf") as ExtractObjects<JSONSchema7Value>
  );
};
