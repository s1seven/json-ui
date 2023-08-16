import { JSONSchema7 } from "json-schema";
import { schemaToTree } from "./schema-to-tree";
import coaSchema from "../../fixtures/coa-schema.json";

test("schema to tree", async () => {
  const schemas = coaSchema;

  const tree = schemaToTree(schemas);
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
