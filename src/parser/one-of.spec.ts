import { JSONSchema7 } from "json-schema";
import { oneOf, oneOfOptions } from "./one-of";

test("it matches the snapshot", async () => {
  const schema = (await import("../../fixtures/schema-with-one-of.json"))
    .default as unknown as JSONSchema7;
  const result = oneOf(schema, 1);
  expect(result).toMatchSnapshot();
});

test("oneOf options parsed correctly", async () => {
  const schema = (await import("../../fixtures/schema-with-one-of.json"))
    .default as unknown as JSONSchema7;
  const result = oneOfOptions(schema, "", 1);
  expect(result).toMatchSnapshot();
});
