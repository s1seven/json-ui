import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./index.css?inline";

import type { JSONSchema7 } from "json-schema";
import {
  resolveAllOf,
  resolveLocalReferences,
} from "./resolve-local-references";

/**
 * Any element.
 */

@customElement("any-element")
export class AnyElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  @property({ type: Number })
  readonly level = 0;

  @property({ type: Object })
  readonly baseSchema: JSONSchema7 = {};

  @property({ type: Object })
  readonly schema: JSONSchema7 = {};

  @property({ type: Array })
  value: any[] = [];

  render() {
    const schema = resolveAllOf(
      resolveLocalReferences(this.baseSchema, this.schema, 5),
      5
    );

    if (schema.type === "array") {
      // Enums.
      const items = schema.items;
      if (items && typeof items === "object" && !Array.isArray(items)) {
        const options = items.enum as string[] | undefined;
        if (options)
          return html`
            <label
              >${schema.title}
              <string-dropdown-element
                .options=${options}
              ></string-dropdown-element>
            </label>
          `;
      }
      return html`
        <label
          >${schema.title}
          <array-element
            .level=${this.level}
            .baseSchema="${this.baseSchema}"
            .arraySchema=${schema}
          ></array-element>
        </label>
      `;
    }

    if (schema.type === "object") {
      return html`
        <object-element
          .level=${this.level}
          .baseSchema=${this.baseSchema}
          .objectSchema=${schema}
        ></object-element>
      `;
    }

    if (schema.type === "string") {
      return html`
        <label
          >${schema.title}
          <string-element .value=${"hello"}></string-element>
        </label>
      `;
    }

    if (schema.type) return html`<strong>${schema.type}</strong><br />`;

    if (schema.allOf) {
      return html`<strong>ALL OF</strong><br />`;
    }

    console.log("no type", schema, this.schema, this.baseSchema);

    return html`no type<br />`;
  }
}
