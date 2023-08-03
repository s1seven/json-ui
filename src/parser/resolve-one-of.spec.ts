import { JSONSchema7 } from "json-schema";
import { resolveOneOf } from "./resolve-one-of";

test("it matches the snapshot", async () => {
  const schema = (await import("../../fixtures/schema-with-one-of.json"))
    .default as unknown as JSONSchema7;
  const result = resolveOneOf(schema, 1);
  expect(result).toMatchSnapshot();
});
