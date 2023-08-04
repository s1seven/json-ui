import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./index.css?inline";
import { resolveRefs } from "./parser/resolve-refs";
import { allOf } from "./parser/all-of";
import { schema } from "./state";

@customElement("json-ui-element")
export class JsonUiElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  @property({ type: Object })
  set schema(newSchema: any) {
    schema.set(allOf(resolveRefs(newSchema)));
  }

  render() {
    return html`<view-element path=""></view-element>`;
  }
}
