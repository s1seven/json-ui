import { joinPaths } from "./path";

export interface ChangeEventDetails {
  path: string;
  value: unknown;
}

export const dispatchChange =
  (target: EventTarget, key = "") =>
  (ev: CustomEvent<ChangeEventDetails>) => {
    target.dispatchEvent(
      new CustomEvent<ChangeEventDetails>("change", {
        detail: {
          ...ev.detail,
          path: joinPaths(key, ev.detail.path),
        },
      })
    );
  };
