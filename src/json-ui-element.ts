import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./index.css?inline";
import { JSONSchema7 } from "json-schema";
import { $RefParser } from "@apidevtools/json-schema-ref-parser";

@customElement("json-ui-element")
export class JsonUiElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  @property({ type: Object })
  set schema(schema: any) {
    $RefParser
      .dereference(schema)
      .then((res) => (this.baseSchema = res as JSONSchema7));
  }

  @state()
  baseSchema?: JSONSchema7;

  render() {
    return html`
      <view-element
        .baseSchema=${this.baseSchema}
        .item=${this.baseSchema}
      ></view-element>
    `;
  }
}
