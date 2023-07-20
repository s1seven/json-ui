import { LitElement, html, nothing, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./index.css?inline";

import type { JSONSchema7 } from "json-schema";
import {
  resolveAllOf,
  resolveLocalReferences,
} from "./resolve-local-references";
import { humanizeKey } from "./humanize";

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

    const titleText = humanizeKey(schema.title || "");
    const title = titleText
      ? html`
          <div class="flex items-center gap-2 select-none">
            ${this.level === 0
              ? html`<h2 class="text-[1.25rem] leading-8 text-slate-700">
                  ${titleText}
                </h2>`
              : html`<h3
                  class="text-[1rem] leading-7 font-medium text-slate-700"
                >
                  ${titleText}
                </h3>`}
            ${schema.description
              ? html`<tooltip-element>${schema.description}</tooltip-element>`
              : nothing}
          </div>
        `
      : nothing;

    const anyOf = schema.anyOf
      ? html`<checkbox-group-element
          class="pb-4 block"
          .type="${schema.type}"
          .level=${this.level}
          .baseSchema="${this.baseSchema}"
          .schemas=${schema.anyOf}
        ></checkbox-group-element>`
      : nothing;

    if (schema.type === "array") {
      const arrayContent = html`
        ${anyOf}
        <array-element
          .level=${this.level}
          .baseSchema="${this.baseSchema}"
          .arraySchema=${schema}
        ></array-element>
      `;

      if (title === nothing) return arrayContent;

      return html`
        <accordion-element .isOpen=${this.level < 2}>
          <div slot="header">${title}</div>
          <div
            slot="content"
            class="${this.level > 0
              ? "shadow-sm ring-1 ring-slate-700/10 ring-inset rounded-lg px-4 py-6"
              : ""}"
          >
            ${arrayContent}
          </div>
        </accordion-element>
      `;
    }

    if (schema.type === "object") {
      const objectContent = html`
        ${anyOf}
        <object-element
          .level=${this.level}
          .baseSchema=${this.baseSchema}
          .objectSchema=${schema}
        ></object-element>
      `;

      if (title === nothing) return objectContent;

      return html`
        <accordion-element .isOpen=${this.level < 2}>
          <div slot="header">${title}</div>
          <div
            slot="content"
            class="${this.level > 0
              ? "shadow-sm ring-1 ring-slate-700/10 ring-inset rounded-lg px-4 py-6"
              : ""}"
          >
            ${objectContent}
          </div>
        </accordion-element>
      `;
    }

    if (schema.type === "string") {
      return html`
        ${title} ${anyOf}
        <string-element .schema=${schema} .value=${"hello"}></string-element>
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

    if (anyOf === nothing) throw ["could not figure out schema type", schema];

    return html` ${title} ${anyOf}`;
  }
}
