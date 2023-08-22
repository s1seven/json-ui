import { JSONSchema7 } from "json-schema";
import { inferType } from "./infer";
import { PRIMITIVE_TYPES } from "../constants";

export type Tree = (string | Tree)[];

export const schemaToTree = (schema: JSONSchema7): Tree | undefined =>
  PRIMITIVE_TYPES.includes(inferType(schema))
    ? void 0
    : Object.entries(schema.properties!).map(([k, value]) => {
        const children = schemaToTree(value as JSONSchema7);
        return children ? [k, children] : k;
      });
