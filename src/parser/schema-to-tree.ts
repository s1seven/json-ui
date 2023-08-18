import { JSONSchema7 } from "json-schema";
import { inferType } from "./infer";

export type Tree = (string | Tree)[];

export const schemaToTree = (schema: JSONSchema7): Tree | undefined =>
  inferType(schema) === "object"
    ? Object.entries(schema.properties!).map(([k, value]) => {
        const children = schemaToTree(value as JSONSchema7);
        return children ? [k, children] : k;
      })
    : void 0;
