import { LitElement, html, nothing, unsafeCSS } from "lit";
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

    const title = html`
      <div>
        ${this.level === 0
          ? html`<h2 class="text-[1.25rem] leading-8 text-slate-700">
              ${schema.title}
            </h2>`
          : html`<h3 class="text-[1rem] leading-7 font-medium text-slate-700">
              ${schema.title}
            </h3>`}
        ${schema.description
          ? html`<p class="text-slate-500 text-base mb-4">
              ${schema.description}
            </p>`
          : nothing}
      </div>
    `;

    const anyOf = schema.anyOf
      ? html`<checkbox-group-element
          .type="${schema.type}"
          .level=${this.level}
          .baseSchema="${this.baseSchema}"
          .schemas=${schema.anyOf}
        ></checkbox-group-element>`
      : nothing;

    if (anyOf !== nothing) {
      console.log("anyOf", schema);
    }

    if (schema.type === "array")
      return html`
        ${title} ${anyOf}
        <array-element
          .level=${this.level}
          .baseSchema="${this.baseSchema}"
          .arraySchema=${schema}
        ></array-element>
      `;

    if (schema.type === "object") {
      return html`
        ${title} ${anyOf}
        <object-element
          .level=${this.level}
          .baseSchema=${this.baseSchema}
          .objectSchema=${schema}
        ></object-element>
      `;
    }

    if (schema.type === "string") {
      return html`
        ${title} ${anyOf}
        <string-element .value=${"hello"}></string-element>
      `;
    }

    if (schema.type) return html`<strong>${schema.type}</strong><br />`;

    if (schema.enum) {
      const options = schema.enum as string[] | undefined;
      if (options)
        return html`
          ${title} ${anyOf}
          <string-dropdown-element
            .options=${options}
          ></string-dropdown-element>
        `;
    }

    // if (schema.oneOf) {
    //   console.log("oneOf", schema);
    // }

    // console.log("no type", schema, this.schema, this.baseSchema);

    return html` ${title} ${anyOf} no type<br />`;
  }
}
