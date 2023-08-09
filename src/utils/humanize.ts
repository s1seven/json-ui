import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import isBoolean from "lodash/isBoolean";
import isNull from "lodash/isNull";
import isUndefined from "lodash/isUndefined";
import isArray from "lodash/isArray";
import isPlainObject from "lodash/isPlainObject";
import map from "lodash/map";

export const humanizeKey = (key: string) =>
  key
    .split(/(?<=[a-z])(?=[A-Z])/)
    .map((word) =>
      word === word.toUpperCase()
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");

export const humanizeValue = (
  value: any
): [title: string, preview?: string][] =>
  isString(value)
    ? [[value]]
    : isNumber(value) || isBoolean(value)
    ? [[String(value)]]
    : isNull(value) || isUndefined(value)
    ? [["N/A"]]
    : isArray(value)
    ? value.length === 0
      ? [["Empty"]]
      : isPlainObject(value[0])
      ? [[`${value.length} Entries`]]
      : [["Entries", value.join(", ")]]
    : isPlainObject(value)
    ? map(value, (v, k) => [k, String(v)])
    : [["Unsupported Value"]];
