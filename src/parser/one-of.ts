import { get, isArray, isBoolean, isObject, omit } from "lodash";
import { ExtractObjects, JSONSchema7Value } from "../utils/helper-types";
import { deepMerge } from "../utils/deep-merge";
import { JSONSchema7 } from "json-schema";

export const getOneOfVal = (
  item: JSONSchema7Value
): JSONSchema7[] | undefined => {
  if (!isObject(item) || isArray(item) || !isArray(item.oneOf)) return void 0;
  const { oneOf } = item;
  if (oneOf.findIndex(isBoolean) !== -1)
    throw new Error("booleans not supported in anyOf");
  return oneOf as JSONSchema7[];
};

export const oneOf = (item: JSONSchema7Value, index: number) => {
  const oneOfVal = getOneOfVal(item);
  if (!oneOfVal) return item;
  if (oneOf.length <= index)
    throw new Error(
      `Index ${index} out of bounds for oneOf array of length ${oneOf.length}`
    );
  if (!isObject(oneOfVal[index]))
    throw new Error("oneOf item is not an object");
  return deepMerge<ExtractObjects<JSONSchema7Value>>(
    oneOfVal[index] as ExtractObjects<JSONSchema7Value>,
    omit(
      item as ExtractObjects<JSONSchema7Value>,
      "oneOf"
    ) as ExtractObjects<JSONSchema7Value>
  );
};

export interface OneOfOption {
  title: string;
  isSelected: boolean;
}

export const oneOfOptions = (
  schema: JSONSchema7,
  path: string,
  selectedIndex: number
): undefined | OneOfOption[] => {
  const item = path ? (get(schema, path) as JSONSchema7Value) : schema;
  const oneOfVal = getOneOfVal(item);
  if (!oneOfVal) return void 0;
  return oneOfVal.map((val, idx) => ({
    title: val.title ?? `Option ${idx}`,
    isSelected: selectedIndex === idx,
  }));
};
