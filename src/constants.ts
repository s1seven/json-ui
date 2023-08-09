import { JSONSchema7TypeName } from "json-schema";

export const PROPERTIES_KEY = "properties";
export const REQUIRED_KEY = "required";
export const REF_KEY = "$ref";

export const PATH_SEPARATOR = ".";

// Additional JSON Schema keywords, allowed for strict validation.
export const AJV_ALLOWED_KEYWORDS = ["meta:license"];

export const DEFAULT_VALUES: Record<JSONSchema7TypeName | "enum", unknown> = {
  number: 0,
  string: "",
  integer: 0,
  boolean: false,
  array: [],
  object: {},
  null: null,
  enum: "",
};

export const ROOT_PATH = "";
