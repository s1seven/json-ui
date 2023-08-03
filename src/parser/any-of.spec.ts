import { JSONSchema7 } from "json-schema";
import { anyOf } from "./any-of";

test("it matches the snapshot", async () => {
  const schema = (await import("../../fixtures/schema-with-any-of.json"))
    .default as unknown as JSONSchema7;
  const result = anyOf(schema, [0, 1]);
  expect(result).toMatchSnapshot();
});
