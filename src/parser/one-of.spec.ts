import { JSONSchema7 } from "json-schema";
import { oneOf } from "./one-of";

test("it matches the snapshot", async () => {
  const schema = (await import("../../fixtures/schema-with-one-of.json"))
    .default as unknown as JSONSchema7;
  const result = oneOf(schema, 1);
  expect(result).toMatchSnapshot();
});
