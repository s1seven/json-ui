import { JSONSchema7 } from "json-schema";
import { PATH_SEPARATOR } from "../constants";
import { inferType } from "../parser/infer";
import { get, isNumber, isUndefined } from "lodash";
import { anyOf, inferAnyOfOptions } from "../parser/any-of";
import { inferOneOfOption, oneOf } from "../parser/one-of";

export const joinPaths = (...paths: (string | undefined)[]) =>
  paths
    .filter(Boolean)
    .join(PATH_SEPARATOR)
    .replace(/^\.*|\.*$/g, "")
    .replace(/\.{2,}/g, ".");

export const popPath = (path: string): string =>
  path.split(PATH_SEPARATOR).slice(0, -1).join(PATH_SEPARATOR);

export const firstPathSegment = (path: string): string =>
  path.split(PATH_SEPARATOR)[0];

export const lastPathSegment = (path: string): string =>
  path.split(PATH_SEPARATOR).slice(-1)[0];

export const navigateSchema = (
  schema: JSONSchema7,
  path: string | number | undefined,
  value: any = void 0
): JSONSchema7 | undefined => {
  if (!path) return schema;
  if (isNumber(path)) path = String(path);
  const parts = path ? path.split(".") : [];
  return parts.reduce<[JSONSchema7 | undefined, any]>(
    ([scm, val], key) => {
      if (isUndefined(scm)) return [scm, val];

      const appliedOneOfOption = inferOneOfOption(scm, val);
      scm = oneOf(scm, appliedOneOfOption);

      const appliedAnyOfOptions = inferAnyOfOptions(scm, val);
      scm = anyOf(scm, appliedAnyOfOptions, true);
      const type = inferType(scm);

      if (type === "object")
        return [scm.properties?.[key] as JSONSchema7, get(val, key)];

      if (type === "array") return [scm.items as JSONSchema7, val];

      return [void 0, val];
    },
    [schema, value]
  )[0];
};
