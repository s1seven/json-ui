import { JSONSchema7 } from "json-schema";
import { isArray, toInteger } from "lodash";
import { PATH_SEPARATOR } from "../constants";

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
  const parts = path.split(".");
  return parts.reduce((acc, key) => {
    if (acc.type === "object") {
      return acc.properties?.[key] as JSONSchema7;
    }
    if (isArray(acc.items)) {
      return acc.items[toInteger(key)] as JSONSchema7;
    }
    return acc as JSONSchema7;
  }, schema);
};
