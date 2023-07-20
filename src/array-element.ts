import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./index.css?inline";

import type { JSONSchema7, JSONSchema7Definition } from "json-schema";
import {
  resolveAllOf,
  resolveLocalReferences,
} from "./resolve-local-references";

/**
 * An object.
 */

@customElement("array-element")
export class ArrayElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  @property({ type: Number })
  readonly level = 0;

  @property({ type: Object })
  readonly baseSchema: JSONSchema7 = {};

  @property({ type: Object })
  readonly arraySchema: JSONSchema7 = {};

  @property({ type: Array })
  value: any[] = [];

  itemsSchema?: JSONSchema7Definition;

  firstUpdated() {
    const resolvedSchema = resolveAllOf(
      resolveLocalReferences(this.baseSchema, this.arraySchema, 5),
      5
    );

    this.itemsSchema = resolvedSchema.items as JSONSchema7Definition;
  }

  render() {
    return html`
      <ol class="mt-4 flex flex-col gap-4">
        ${this.value.map(
          (_) => html`<li class="list-decimal ml-6 pl-4">
            <any-element
              .level=${this.level}
              .baseSchema="${this.baseSchema}"
              .schema="${this.itemsSchema}"
            ></any-element>
          </li>`
        )}
        <li class="ml-6 pl-4">
          <button
            @click="${() => (this.value = [...this.value, {}])}"
            class="text-[0.8125rem] font-bold rounded-md inline-flex items-center justify-center gap-1 px-2 py-1 shadow-sm ring-1 ring-slate-700/30 cursor-default focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <svg
              class="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              class="nu rw"
            >
              <path
                d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
              ></path>
            </svg>
            Add item
          </button>
        </li>
      </ol>
    `;
  }
}
