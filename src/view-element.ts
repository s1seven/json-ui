import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./index.css?inline";
import { JSONSchema7 } from "json-schema";
import { path } from "./state";
import { dispatchChange } from "./utils/dispatch-change";

@customElement("view-element")
export class ViewElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  @property({ type: Object })
  schema?: JSONSchema7;

  value = {};

  render() {
    return html`<div class="flex flex-col gap-4">
      ${this.renderHeader()}

      <one-of-element
        @change=${dispatchChange(this)}
        .schema=${this.schema!}
        .value=${this.value!}
      ></one-of-element>
      <button>NEXT</button>
    </div>`;
  }

  // - back button
  // - Step 1 of 28
  private renderHeader() {
    const pathParts = path.get()?.split(".");
    return html`<div>
      <button
        class="text-blue-500"
        @click=${() => {
          pathParts?.pop();
          path.set(pathParts?.join("."));
        }}
      >
        Back
      </button>
      <strong>HEADER</strong>
      <span>PATH:${path.get()}</span>
    </div>`;
  }
}
