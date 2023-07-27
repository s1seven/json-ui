import { TemplateResult, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { JSONSchema7 } from "json-schema";
import {
  resolveAllOf,
  resolveLocalReferences,
} from "./resolve-local-references";
import { humanizeKey } from "./humanize";
import { dispatchValueChanged } from "./pure-functions/dispatch-value-changed";
import { BaseElement } from "./base-element";

/**
 * Any element.
 */

@customElement("any-element")
export class AnyElement extends BaseElement<any> {
  @property({ type: String })
  readonly key?: string;

  render() {
    const schema = resolveAllOf(
      resolveLocalReferences(this.baseSchema, this.schema, 5),
      5
    );

    const titleText = humanizeKey(this.key || schema.title || "");
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

    const anyOf: TemplateResult | typeof nothing = schema.anyOf
      ? html`<checkbox-group-element
          @value-changed="${dispatchValueChanged(this)}"
          class="pb-4 block"
          .type="${schema.type}"
          .path=${this.path}
          .baseSchema="${this.baseSchema}"
          .schemas=${schema.anyOf}
        ></checkbox-group-element>`
      : nothing;

    if (schema.type === "array") {
      const enumItems = (schema?.items as JSONSchema7).enum;
      if (enumItems) {
        return html`
          ${title} ${anyOf}
          <multi-dropdown-element
            @value-changed="${dispatchValueChanged(this)}"
            .options=${enumItems}
          ></multi-dropdown-element>
        `;
      }
      const arrayContent: TemplateResult = html`
        ${anyOf}
        <array-element
          @value-changed=${dispatchValueChanged(this)}
          .path=${this.path}
          .baseSchema="${this.baseSchema}"
          .schema=${schema}
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
      const objectContent: TemplateResult = html`
        ${anyOf}
        <object-element
          @value-changed=${dispatchValueChanged(this)}
          .path=${this.path}
          .baseSchema=${this.baseSchema}
          .schema=${schema}
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
        <string-element
          @value-changed=${dispatchValueChanged(this)}
          .schema=${schema}
          .value=${"hello"}
        ></string-element>
      `;
    }

    if (schema.type) return html`<strong>${schema.type}</strong><br />`;

    if (schema.enum) {
      const options = schema.enum as string[] | undefined;
      if (options)
        return html`
          ${title} ${anyOf}
          <single-dropdown-element
            @value-changed=${dispatchValueChanged(this)}
            .options=${options}
          ></single-dropdown-element>
        `;
    }

    if (anyOf === nothing) throw ["could not figure out schema type", schema];

    return html` ${title} ${anyOf}`;
  }
}
