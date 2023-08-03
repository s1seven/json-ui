import { JSONSchema7 } from "json-schema";
import $RefParser from "@apidevtools/json-schema-ref-parser";

test("it matches the snapshot", async () => {
  const schema = (await import(
    "../../fixtures/schema-with-ref.json"
  )) as unknown as JSONSchema7;
  const result = await $RefParser.dereference(schema);
  expect(result).toMatchSnapshot();
});
