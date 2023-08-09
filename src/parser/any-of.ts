import { isObject, isArray, omit, get, set, isBoolean } from "lodash";
import { deepMerge } from "../utils/deep-merge";
import { JSONSchema7Value, ExtractObjects } from "../utils/helper-types";
import { JSONSchema7 } from "json-schema";
import Ajv from "ajv";
import { ajv, ajvFactory } from "./ajv";
import { navigateSchema } from "../utils/path";
import { ANY_OF_KEY, ANY_OF_REF_KEY } from "../constants";

export const getAnyOfVal = (
  item: JSONSchema7Value
): JSONSchema7[] | undefined => {
  if (!isObject(item) || isArray(item) || !isArray(item.anyOf)) return void 0;
  const { anyOf } = item;
  if (anyOf.findIndex(isBoolean) !== -1)
    throw new Error("booleans not supported in anyOf");
  return anyOf as JSONSchema7[];
};

export const anyOf = (
  item: JSONSchema7,
  indices: number[],
  preserveProp = false
): JSONSchema7 => {
  const anyOfVal = getAnyOfVal(item);
  if (!anyOfVal) return item;
  return deepMerge<ExtractObjects<JSONSchema7Value>>(
    ...indices.map((idx) => anyOfVal[idx] as ExtractObjects<JSONSchema7Value>),
    omit(
      item as ExtractObjects<JSONSchema7Value>,
      ANY_OF_KEY
    ) as ExtractObjects<JSONSchema7Value>,
    preserveProp
      ? ({
          [ANY_OF_REF_KEY]: item[ANY_OF_KEY],
        } as any)
      : {}
  );
};

export interface AnyOfOption {
  title: string;
  isIllogicalAfterToggle: boolean;
}

export const anyOfOptions = (schema: JSONSchema7) =>
  (getAnyOfVal(schema) ?? []).map((val, i) => val.title ?? `Option ${i}`);

export const inferAnyOfOptions = (
  schema: JSONSchema7,
  value: unknown
): number[] => {
  const options = anyOfOptions(schema);
  return options?.reduce(
    (selectedIndices, _, i) =>
      ajvFactory().compile(anyOf(schema, [...selectedIndices, i]))(value)
        ? [...selectedIndices, i]
        : selectedIndices,
    [] as number[]
  );
};
