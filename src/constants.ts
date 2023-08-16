import { JSONSchema7TypeName } from "json-schema";

export const PROPERTIES_KEY = "properties";
export const ADDITIONAL_PROPERTIES_KEY = "additionalProperties";
export const REQUIRED_KEY = "required";
export const REF_KEY = "$ref";
export const ANY_OF_KEY = "anyOf";
export const ANY_OF_REF_KEY = "$ref:anyOf";

export const PATH_SEPARATOR = ".";
export const PATH_UP = Symbol();

// Additional JSON Schema keywords, allowed for strict validation.
export const AJV_ALLOWED_KEYWORDS = ["meta:license"] as const;

export const ALL_TYPES: (JSONSchema7TypeName | "enum" | undefined)[] = [
  "string",
  "number",
  "integer",
  "boolean",
  "array",
  "object",
  "null",
  "enum",
];

export const PRIMITIVE_TYPES: Partial<typeof ALL_TYPES> = [
  "string",
  "number",
  "enum",
  "boolean",
];

export const DEFAULT_VALUES: Record<
  JSONSchema7TypeName | "enum",
  () => unknown
> = {
  number: () => 0,
  string: () => "",
  integer: () => 0,
  boolean: () => false,
  array: () => [],
  object: () => ({}),
  null: () => null,
  enum: () => "",
};

export const ROOT_PATH = "";
