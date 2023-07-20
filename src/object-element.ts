import { LitElement, html, nothing, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./index.css?inline";

import type { JSONSchema7 } from "json-schema";
import {
  resolveAllOf,
  resolveLocalReferences,
} from "./resolve-local-references";

/**
 * An object.
 */

@customElement("object-element")
export class ObjectElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  @property({ type: Number })
  readonly level = 0;

  @property({ type: Object })
  readonly baseSchema: JSONSchema7 = {};

  @property({ type: Object })
  readonly objectSchema: JSONSchema7 = {};

  @property({ type: Object })
  value: Object | undefined = {};

  @property({ type: String })
  title = "";

  @property({ type: String })
  description = "";

  @property({ type: Array })
  fields: JSONSchema7[] = [];

  firstUpdated() {
    this.fields = Object.entries(this.objectSchema.properties ?? {}).map(
      ([title, value]) => ({ ...(value as JSONSchema7), title })
    );

    if (this.objectSchema.title) {
      this.title = this.objectSchema.title;
    }

    if (this.objectSchema.description) {
      this.description = this.objectSchema.description;
    }
  }

  render() {
    return html`
      <div
        class="${this.level > 0
          ? "shadow-sm ring-1 ring-slate-700/10 rounded-lg px-4 py-6"
          : ""} flex flex-col gap-4"
      >
        <div>
          ${this.level === 0
            ? html`<h2 class="text-[1.25rem] leading-8 text-slate-700">
                ${this.title}
              </h2>`
            : html`<h3 class="text-[1rem] leading-7 font-medium text-slate-700">
                ${this.title}
              </h3>`}
          ${this.description
            ? html`<p class="text-slate-500 text-base mb-4">
                ${this.description}
              </p>`
            : nothing}
        </div>
        ${this.fields.map(
          (field) => html`<any-element
            .level="${this.level + 1}"
            .baseSchema="${this.baseSchema}"
            .schema="${field}"
          ></any-element>`
        )}
      </div>
    `;
  }
}
