import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./index.css?inline";

@customElement("json-ui-element")
export class JsonUiElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  @property({ type: Object })
  set schema(schema: any) {
    console.log("schema from lit", schema);
  }

  render() {
    return html`
      <button class="px-4 py-2 leading-4 font-bold bg-slate-300 rounded">
        Sick button
      </button>
    `;
  }
}
