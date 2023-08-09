import { isArray, isBoolean, isObject, omit } from "lodash";
import { ExtractObjects, JSONSchema7Value } from "../utils/helper-types";
import { deepMerge } from "../utils/deep-merge";
import { JSONSchema7 } from "json-schema";
import { ajv } from "./ajv";

export const getOneOfProp = (
  item: JSONSchema7Value
): JSONSchema7[] | undefined => {
  if (!isObject(item) || isArray(item) || !isArray(item.oneOf)) return void 0;
  const { oneOf } = item;
  if (oneOf.findIndex(isBoolean) !== -1)
    throw new Error("booleans not supported in anyOf");
  return oneOf as JSONSchema7[];
};

export const oneOf = (item: JSONSchema7, index: number): JSONSchema7 => {
  const oneOfVal = getOneOfProp(item);
  if (!oneOfVal) return item;
  if (oneOfVal.length <= index)
    throw new Error(
      `Index ${index} out of bounds for oneOf array of length ${oneOfVal.length}`
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

export const oneOfOptions = (schema: JSONSchema7): string[] => {
  const oneOfVal = getOneOfProp(schema);
  if (!oneOfVal) return [];
  return oneOfVal.map((val, idx) => val.title ?? `Option ${idx}`);
};

export const inferOneOfOption = (
  schema: JSONSchema7,
  value: unknown
): number => {
  const options = oneOfOptions(schema);
  return options.findIndex((_, i) => ajv.compile(oneOf(schema, i))(value));
};
