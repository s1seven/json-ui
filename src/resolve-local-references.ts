import { JSONSchema7 } from "json-schema";

export const resolveLocalReferences = (
  schema: JSONSchema7,
  object: JSONSchema7,
  maxDepth = 2
): JSONSchema7 => {
  const definitions = schema.definitions ?? {};
  const resolve = (child: any, depth: number): any => {
    if (depth > maxDepth) return child;
    if (Array.isArray(child))
      return child.map((item) => resolve(item, depth + 1));
    if (typeof child !== "object") return child;
    const ref = child["$ref"];
    if (!ref)
      return Object.fromEntries(
        Object.entries(child).map(([key, value]) => [
          key,
          resolve(value, depth + 1),
        ])
      );
    const resolved = definitions[
      ref.replace("#/definitions/", "")
    ] as JSONSchema7;
    return {
      ...child,
      ...resolve(resolved ?? {}, depth + 1),
      $ref: void 0,
      $resolved: true,
    };
  };
  return resolve(object, 1);
};

export const resolveAllOf = (
  object: JSONSchema7,
  maxDepth = 2
): JSONSchema7 => {
  const resolve = (child: any, depth: number): any => {
    if (depth > maxDepth) return child;
    if (Array.isArray(child))
      return child.map((item) => resolve(item, depth + 1));
    if (typeof child !== "object") return child;

    const allOf = child["allOf"] as JSONSchema7[];
    if (!allOf)
      return Object.fromEntries(
        Object.entries(child).map(([key, value]) => [
          key,
          resolve(value, depth + 1),
        ])
      );

    return allOf
      .map((entry) => resolveAllOf(entry, depth + 1))
      .reduce((acc, curr) => ({ ...acc, ...curr }), {
        ...child,
        allOf: void 0,
      });
  };
  return resolve(object, 1);
};
