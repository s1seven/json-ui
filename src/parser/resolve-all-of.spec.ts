import { JSONSchema7 } from "json-schema";
import { resolveAllOf } from "./resolve-all-of";

test("it matches the snapshot", async () => {
  const schema = (await import("../../fixtures/schema-with-all-of.json"))
    .default as unknown as JSONSchema7;
  const result = resolveAllOf(schema);
  expect(result).toMatchSnapshot();
});
