import { JSONSchema7 } from "json-schema";
import { inferType } from "./infer";

export type Tree = (string | Tree)[];
// export type Tree = string[] | [string, Tree];
// export type Tree = (string | Tree)[];

// const tree: Tree = ["school", ["person", ["name", "age"]], "car"];

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

export const schemaToTree2 = (schema: JSONSchema7): Tree | undefined => {
  const type = inferType(schema);
  return type === "object"
    ? Object.entries(schema.properties!).map(([k, value]) => {
        const children = schemaToTree2(value as JSONSchema7);
        return children ? [k, children] : k;
      })
    : void 0;
};
