import { JSONSchema7 } from "json-schema";
import { inferType } from "./infer";
import { ajvFactory } from "./ajv";
import { get } from "lodash";

export type TreeItem = [
  label: string,
  isValidOverlap: boolean,
  children: TreeItem[]
];

const ajv = ajvFactory();

export const overlapTree = (
  schemas: (JSONSchema7 | undefined)[],
  key = ""
): TreeItem => {
  if (schemas.includes(void 0)) return [key, false, []];
  if (schemas.length < 1) throw new Error("No schemas provided.");
  const schema = schemas[0]!;
  const type = inferType(schema);

  const mergedSchema = {
    allOf: schemas,
  };

  const isValid = ajv.validateSchema(mergedSchema) as boolean;
  console.log(isValid, JSON.stringify(mergedSchema));

  return [
    key,
    isValid,
    type === "object"
      ? Object.keys(schema.properties!).map((key) =>
          overlapTree(
            schemas.map((scm) =>
              get(scm, `properties.${key}`)
            ) as JSONSchema7[],
            key
          )
        )
      : [],
  ];
};
