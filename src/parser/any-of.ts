import { isObject, isArray, omit, get, set, isBoolean } from "lodash";
import { deepMerge } from "../utils/deep-merge";
import { JSONSchema7Value, ExtractObjects } from "../utils/helper-types";
import { JSONSchema7 } from "json-schema";
import Ajv from "ajv";

export const getAnyOfVal = (
  item: JSONSchema7Value
): JSONSchema7[] | undefined => {
  if (!isObject(item) || isArray(item) || !isArray(item.anyOf)) return void 0;
  const { anyOf } = item;
  if (anyOf.findIndex(isBoolean) !== -1)
    throw new Error("booleans not supported in anyOf");
  return anyOf as JSONSchema7[];
};

export const anyOf = (item: JSONSchema7, indices: number[]): JSONSchema7 => {
  const anyOfVal = getAnyOfVal(item);
  if (!anyOfVal) return item;
  return deepMerge<ExtractObjects<JSONSchema7Value>>(
    ...indices.map((idx) => anyOfVal[idx] as ExtractObjects<JSONSchema7Value>),
    omit(
      item as ExtractObjects<JSONSchema7Value>,
      "anyOf"
    ) as ExtractObjects<JSONSchema7Value>
  );
};

export interface AnyOfOption {
  title: string;
  isIllogicalAfterToggle: boolean;
  isSelected: boolean;
}

export const anyOfOptions = (
  schema: JSONSchema7,
  path: string,
  selectedIndices: number[]
): undefined | AnyOfOption[] => {
  const item = path ? (get(schema, path) as JSONSchema7Value) : schema;
  const anyOfVal = getAnyOfVal(item);
  if (!anyOfVal) return void 0;
  const clonedSchema = structuredClone(schema);
  const ajv = new Ajv();
  return anyOfVal.map((val, idx) => {
    const isSelected = selectedIndices.includes(idx);
    const indicesAfterToggle = isSelected
      ? selectedIndices.filter((i) => i !== idx)
      : [...selectedIndices, idx];
    const schemaAfterToggle = anyOf(item as JSONSchema7, indicesAfterToggle);
    set(clonedSchema, path, schemaAfterToggle);
    const hasTypeConflict =
      new Set(indicesAfterToggle.map((i) => anyOfVal[i]?.type).filter(Boolean))
        .size > 1;
    const isIllogicalAfterToggle =
      hasTypeConflict || !(ajv.validateSchema(clonedSchema) as boolean);
    return {
      title: val.title ?? `Option ${idx}`,
      isIllogicalAfterToggle,
      isSelected,
    };
  });
};
