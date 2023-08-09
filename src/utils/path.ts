import { JSONSchema7 } from "json-schema";
import { PATH_SEPARATOR } from "../constants";
import { inferType } from "../parser/infer";

export const joinPaths = (...paths: (string | undefined)[]) =>
  paths
    .filter(Boolean)
    .join(PATH_SEPARATOR)
    .replace(/^\.*|\.*$/g, "")
    .replace(/\.{2,}/g, ".");

export const popPath = (path: string): string =>
  path.split(PATH_SEPARATOR).slice(0, -1).join(PATH_SEPARATOR);

export const lastPathSegment = (path: string): string =>
  path.split(PATH_SEPARATOR).slice(-1)[0];

export const navigate = (schema: JSONSchema7, path: string): JSONSchema7 => {
  const parts = path ? path.split(".") : [];
  return parts.reduce((acc, key) => {
    const type = inferType(acc);

    if (type === "object") {
      return acc.properties?.[key] as JSONSchema7;
    }
    if (type === "array") {
      return acc.items as JSONSchema7;
    }
    return acc as JSONSchema7;
  }, schema);
};
