import { joinPaths } from "./path";

export interface ChangeEventDetails<T = unknown> {
  path: string;
  value: T;
}

export const dispatchChange =
  (target: EventTarget, key = "") =>
  (ev: CustomEvent<ChangeEventDetails> | { detail: ChangeEventDetails }) => {
    target.dispatchEvent(
      new CustomEvent<ChangeEventDetails>("change", {
        detail: {
          ...ev.detail,
          path: joinPaths(key, ev.detail.path),
        },
      })
    );
  };
