import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import isBoolean from "lodash/isBoolean";
import isNull from "lodash/isNull";
import isUndefined from "lodash/isUndefined";
import isArray from "lodash/isArray";
import map from "lodash/map";
import { every, isObject, size } from "lodash";

export const humanizeKey = (key: string) =>
  key
    .split(/(?<=[a-z])(?=[A-Z])/)
    .map((word) =>
      word === word.toUpperCase()
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");

// export const humanizeValue = (
//   value: any
// ): [title: string, preview?: string][] =>
//   isString(value)
//     ? [[value]]
//     : isNumber(value) || isBoolean(value)
//     ? [[String(value)]]
//     : isNull(value) || isUndefined(value)
//     ? [["N/A"]]
//     : isArray(value)
//     ? value.length === 0
//       ? [["Empty"]]
//       : isPlainObject(value[0])
//       ? [[`${value.length} Entries`]]
//       : [["Entries", value.join(", ")]]
//     : isPlainObject(value)
//     ? map(value, (v, k) => [k, String(v)])
//     : [["Unsupported Value"]];

export const isStringArray = (value: any) =>
  isArray(value) && every(value, (item) => typeof item === "string");

export const humanizeValue = (
  value: any
): [title: string, preview?: string][] =>
  isObject(value) && !isStringArray(value)
    ? [[map(value, (v, k) => humanizeToString(v)).join(", ")]]
    : // ? map(value, (v, k) => [k, humanizeToString(v)])
      [[humanizeToString(value)]];

export const humanizeToString = (value: any): string =>
  isNull(value) || isUndefined(value)
    ? "N/A"
    : isStringArray(value)
    ? (value as string[]).join(", ")
    : isString(value) || isNumber(value) || isBoolean(value)
    ? String(value)
    : humanizeComplexValue(value);

export const humanizeComplexValue = (value: any): string => {
  const sz = size(value);
  if (sz === 0) return "Empty";
  return `${sz} ${
    isArray(value)
      ? "Item" + (sz > 1 ? "s" : "")
      : "Propert" + (sz > 1 ? "ies" : "y")
  }`;
};
