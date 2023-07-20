import { LitElement, html, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import styles from "./index.css?inline";
import * as schema from "./schema.json";
import { JSONSchema7 } from "json-schema";

@customElement("json-ui-element")
export class JSONUIElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  render() {
    return html`
      <any-element
        .baseSchema=${schema}
        .schema=${schema as unknown as JSONSchema7}
      ></any-element>
    `;
  }
}
