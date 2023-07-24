import { LitElement } from "lit";

export const dispatchValueChanged = (element: LitElement) => (ev: any) =>
  element.dispatchEvent(new CustomEvent("value-changed", ev));
