import { isArray, isObject, omit } from "lodash";
import { ExtractObjects, JSONSchema7Value } from "../utils/helper-types";
import { deepMerge } from "../utils/deep-merge";

export const resolveOneOf = (item: JSONSchema7Value, index: number) => {
  if (!isObject(item) || isArray(item) || !isArray(item.oneOf)) return item;
  const { oneOf } = item;
  if (oneOf.length <= index)
    throw new Error(
      `Index ${index} out of bounds for oneOf array of length ${oneOf.length}`
    );
  if (!isObject(oneOf[index])) throw new Error("oneOf item is not an object");
  return deepMerge<ExtractObjects<JSONSchema7Value>>(
    oneOf[index] as ExtractObjects<JSONSchema7Value>,
    omit(item, "oneOf") as ExtractObjects<JSONSchema7Value>
  );
};
