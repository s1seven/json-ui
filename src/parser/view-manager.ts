import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import { inferType } from "./infer-type";
import { isObject } from "lodash";


export const getView = (schema: JSONSchema7, key?: string) => {

};




// export interface View {
//   schema: JSONSchema7;
//   title: string;
//   // A list of properties that have been checked before. Only applicable for object views.
//   checked: string[];
// }

// export const viewManagerFactory = (schema: JSONSchema7) => {
//   const views = getViews(schema);
//   console.log({ views });
//   return {};
// };

// export const getViews = (schema: JSONSchema7, key?: string): View[] => {
//   const type = inferType(schema);

//   if (isObject(schema) && isObject(schema.properties)) {
//     return Object.entries(schema.properties || {})
//       .filter(([, prop]) => !isPrimitive(inferType(prop)))
//       .flatMap(([key, prop]) => getViews(prop as JSONSchema7, key))
//       .concat([
//         {
//           schema,
//           title: key || schema.title || "no title",
//           checked: [],
//         },
//       ]);
//   }

//   if (type === "array") {
//     return [
//       {
//         schema,
//         title: schema.title || "no title",
//         checked: [],
//       },
//     ];
//   }

//   throw new Error(`Could not get views for type: ${type}`);
// };

export const isPrimitive = (typeName: JSONSchema7TypeName) => {
  return (
    typeName === "string" || typeName === "number" || typeName === "boolean"
  );
};
