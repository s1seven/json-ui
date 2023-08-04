export const append = (path: string, ...keys: string[]) =>
  (path ? `${path}.` : "") + keys.join(".");
