export type ValueOf<T> = T[keyof T];

export type ExtractObjects<T> = T extends object
  ? T extends any[]
    ? never
    : T
  : never;

export type ExtractArrays<T> = T extends object
  ? T extends any[]
    ? T
    : never
  : never;
