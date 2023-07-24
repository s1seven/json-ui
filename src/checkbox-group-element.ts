import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./index.css?inline";
import { JSONSchema7, JSONSchema7TypeName } from "json-schema";

/**
 * Checkbox group element.
 */

@customElement("checkbox-group-element")
export class CheckboxGroupElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  @property({ type: Array })
  readonly path: (string | number)[] = [];

  @property({ type: String })
  readonly type?: JSONSchema7TypeName;

  @property({ type: Object })
  readonly baseSchema: JSONSchema7 = {};

  @property({ type: Array })
  readonly schemas: JSONSchema7[] = [];

  render() {
    return html`Choose one or more:
      <ul class="flex flex-col gap-4">
        ${this.schemas.map(
          (schema) => html`
            <li class="flex gap-4">
              <input
                type="checkbox"
                class="shrink-0 mt-1 border-gray-200 rounded text-blue-600 focus:ring-blue-500"
              />
              <any-element
                class="flex-1"
                .level=${this.level}
                .baseSchema="${this.baseSchema}"
                .schema="${{ type: this.type, ...schema }}"
              ></any-element>
            </li>
          `
        )}
      </ul>`;
  }
}
