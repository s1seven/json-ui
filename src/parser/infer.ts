import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import {
  isArray,
  isBoolean,
  isNull,
  isNumber,
  isObject,
  isString,
} from "lodash";
import { JSONSchema7Value } from "../utils/helper-types";
import { lastPathSegment } from "../utils/path";
import { ALL_TYPES } from "../constants";

export const inferType = (
  schema?: JSONSchema7 | JSONSchema7Value,
  value?: any
): (typeof ALL_TYPES)[number] => {
  if (isBoolean(schema)) return "boolean";
  if (isString(schema)) return "string";
  if (isNumber(schema)) return "number";
  if (isNull(schema)) throw new Error("null type not supported");
  // if (isUndefined(schema)) throw new Error("undefined type not supported");
  if (isArray(schema) || isArray(schema?.type))
    throw new Error("multiple types not supported");
  if (schema?.type) return schema.type as JSONSchema7TypeName;
  if (schema?.properties) return "object";
  if (schema?.items) return "array";
  if (schema?.enum) {
    if (!isArray(schema?.enum)) return inferType(schema?.enum);
    return inferType(schema?.enum?.[0] as JSONSchema7);
  }

  if (isArray(value)) return "array";
  if (isObject(value)) return "object";
  if (isNumber(value)) return "number";
  if (isString(value)) return "string";

  return void 0;
};

export const inferTitle = (schema: JSONSchema7, path: string): string =>
  schema.title ?? lastPathSegment(path);

export const inferDescription = (schema: JSONSchema7): string =>
  schema.description ?? "";
