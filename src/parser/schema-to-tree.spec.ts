import { schemaToTree2 } from "./schema-to-tree";
import coaSchema from "../../fixtures/coa-schema.json";
import { resolveRefs } from "./resolve-refs";
import { JSONSchema7 } from "json-schema";
import { allOf } from "./all-of";

test("schema to tree", async () => {
  const schema = allOf(resolveRefs(coaSchema as any as JSONSchema7));

  console.log("my schema", schema);

  const tree = schemaToTree2(schema);
  console.log("my tree", tree);
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
