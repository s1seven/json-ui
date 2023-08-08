import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import {
  isArray,
  isBoolean,
  isNull,
  isNumber,
  isString,
  isUndefined,
} from "lodash";
import { JSONSchema7Value } from "../utils/helper-types";

export const inferType = (
  schema: JSONSchema7 | JSONSchema7Value
): JSONSchema7TypeName => {
  if (isBoolean(schema)) return "boolean";
  if (isString(schema)) return "string";
  if (isNumber(schema)) return "number";
  if (isNull(schema)) throw new Error("null type not supported");
  if (isUndefined(schema)) throw new Error("undefined type not supported");
  if (isArray(schema) || isArray(schema.type))
    throw new Error("multiple types not supported");
  if (schema.type) return schema.type as JSONSchema7TypeName;
  if (schema.properties) return "object";
  if (schema.items) return "array";
  throw new Error(`Could not infer type: ${JSON.stringify(schema)}`);
};
