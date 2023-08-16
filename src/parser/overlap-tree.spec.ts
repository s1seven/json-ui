import { JSONSchema7 } from "json-schema";
import { overlapTree } from "./overlap-tree";
import { ajvFactory } from "./ajv";

test("simple tree overlap", async () => {
  const ajv = ajvFactory();

  console.log(
    "hello",
    ajv.validateSchema({
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "objesdct",
      properties: {
        example: {
          type: "string",
          minLength: 10,
          maxLength: 5,
        },
      },
      required: ["missingProperty"],
    }),
    ajv.errors
  );

  const schemas: JSONSchema7[] = [
    {
      type: "object",
      properties: {
        brand: {
          type: "string",
        },
        model: {
          type: "string",
        },
      },
    },
    {
      type: "object",
      properties: {
        brand: {
          type: "object",
        },
        model: {
          type: "string",
        },
      },
    },
  ];
  const tree = overlapTree(schemas);
  expect(tree).toMatchSnapshot();
});

// export const asdasd: TreeItem = [
//   "Root",
//   true,
//   [
//     ["Root.1", true],
//     ["Root.2", true, [["Root.2.1", true]]],
//     ["Root.1", true],
//   ],
// ];
