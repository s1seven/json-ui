import { JSONSchema7 } from "json-schema";

export type Tree = Array<string | Tree>;

export const schemaToTree = (schema: JSONSchema7): Tree => {
  if (typeof schema === "string") {
    return [schema];
  } else if (Array.isArray(schema)) {
    const resultArray: Tree = [];
    for (const item of schema) {
      resultArray.push(schemaToTree(item));
    }
    return resultArray;
  } else if (typeof schema === "object") {
    const resultArray: Tree = [];
    for (const key in schema.properties) {
      if (schema.properties[key]) {
        resultArray.push(key);
        resultArray.push(schemaToTree(schema.properties[key] as JSONSchema7));
      }
    }
    return resultArray;
  }
  return [];
};
