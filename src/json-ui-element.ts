import { LitElement, html, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import styles from "./index.css?inline";
import * as schema from "./schema.json";
import { JSONSchema7 } from "json-schema";

@customElement("json-ui-element")
export class JSONUIElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  valueChanged(ev: any) {
    console.log("value changed", ev);
  }

  render() {
    return html`
      <!-- <stepper-element
        @value-changed=${this.valueChanged}
        .path=${[]}
        .baseSchema=${schema}
        .schema=${schema as unknown as JSONSchema7}
      ></stepper-element> -->
      <any-element
        @value-changed=${this.valueChanged}
        .path=${[]}
        .baseSchema=${schema}
        .schema=${schema as unknown as JSONSchema7}
      ></any-element>
    `;
  }
}
