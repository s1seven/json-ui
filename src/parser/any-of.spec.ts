import { JSONSchema7 } from "json-schema";
import { anyOf, anyOfOptions } from "./any-of";

test("anyOf applied correctly", async () => {
  const schema = (await import("../../fixtures/schema-with-any-of.json"))
    .default as unknown as JSONSchema7;
  const result = anyOf(schema, [0, 1]);
  expect(result).toMatchSnapshot();
});

test("anyOf options parsed correctly", async () => {
  const schema = (await import("../../fixtures/schema-with-any-of.json"))
    .default as unknown as JSONSchema7;
  const result = anyOfOptions(schema, "", []);
  expect(result).toMatchSnapshot();
});

test("selected anyOf options parsed correctly", async () => {
  const schema = (await import("../../fixtures/schema-with-any-of.json"))
    .default as unknown as JSONSchema7;
  const selectedIndices = [0, 1];
  const result = anyOfOptions(schema, "", selectedIndices);
  expect(result).toMatchSnapshot();
});
