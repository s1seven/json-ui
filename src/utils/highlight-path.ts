import { escape, get, isObject, set } from "lodash";

export const highlightPath = (obj: Object, path: string) => {
  const value = get(obj, path);
  const clonedObj = structuredClone(obj);
  if (value)
    set(
      clonedObj,
      path,
      JSON.parse(
        JSON.stringify(value, (_, v) =>
          isObject(v) ? v : `<span class=\'json-ui-highlight\'>${escape(v)}</span>`
        )
      )
    );
  return JSON.stringify(clonedObj, null, 2).replace(/"/g, "");
};
