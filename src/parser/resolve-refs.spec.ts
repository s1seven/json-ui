import { JSONSchema7 } from "json-schema";
import { resolveRefs } from "./resolve-refs";

test("it matches the snapshot", async () => {
  const schema = (await import("../../fixtures/schema-with-ref.json"))
    .default as unknown as JSONSchema7;
  const result = resolveRefs(schema);
  expect(result).toMatchSnapshot();
});
