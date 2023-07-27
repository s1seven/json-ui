import { LitElement } from "lit";

export const dispatchValueChanged =
  (element: LitElement) =>
  (ev: { detail: ValueChange } | CustomEvent<ValueChange>) =>
    element.dispatchEvent(new CustomEvent("value-changed", ev));

export interface ValueChange {
  path: (string | number)[];
  value: any;
}
