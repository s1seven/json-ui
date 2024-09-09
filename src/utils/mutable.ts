/**
 * Lightweight State Management Solution by Christoph Bühler
 *
 * - `dispatcherFactory`: Manages listeners for state changes.
 * - `Mutable`: Represents a mutable object with methods for manipulating state.
 * - `mutable`: Returns a mutable object for state manipulation.
 *    - `set`: Updates the state or a specific path.
 *    - `select`: Selects a subpath for further manipulation.
 *    - `on`: Subscribes to state changes, with optional `nosy` parameter.
 */

import { assign, get, set, GetFieldType } from "lodash";

export const dispatcherFactory = (listeners = new Set<() => any>()) => ({
  on: (listener: () => any) => listeners.add(listener),
  off: (listener: () => any) => listeners.delete(listener),
  emit: () => listeners.forEach((listener) => listener()),
});

type Mutable<T extends object, P extends string | undefined> = {
  set: (value: P extends string ? GetFieldType<T, P> : T) => void;
  select: <SubPath extends string>(
    subPath: SubPath
  ) => Mutable<T, P extends string ? `${P}.${SubPath}` : SubPath>;
  on: (
    listener: (s: GetFieldType<T, P>) => unknown,
    nosy?: boolean
  ) => () => void;
  get: () => P extends string ? GetFieldType<T, P> : T;
  state: T;
};

export const mutable = <T extends object, P extends string | undefined>(
  state: T,
  path?: P,
  dispatcher = dispatcherFactory()
): Mutable<T, P> => ({
  set: (value) => (
    path ? set(state, path, value) : assign(state, value), dispatcher.emit()
  ),
  select: (subPath) =>
    mutable(state, path ? `${path}.${subPath}` : (subPath as any)),
  on: (listener, nosy = false) => {
    let value: GetFieldType<T, P> | undefined;
    const check = () => {
      const newValue = (path ? get(state, path) : state) as GetFieldType<T, P>;
      if (newValue === value && !nosy) return;
      value = newValue;
      listener(value);
    };
    check();
    dispatcher.on(check);
    return () => dispatcher.off(check);
  },
  get(): P extends string ? GetFieldType<T, P> : T {
    return path ? (get(state, path) as GetFieldType<T, P>) : (state as any);
  },
  state,
});

export const rollingSelect = (
  state: Mutable<any, any>,
  listener: (value: any) => unknown
) => {
  let offFn: (() => void) | undefined;
  return {
    roll: (subPath: string) => {
      offFn && offFn();
      offFn = (subPath ? state.select(subPath) : state).on(listener);
    },
  };
};
