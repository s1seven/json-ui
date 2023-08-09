import { LitElement, TemplateResult, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./index.css?inline";
import { JSONSchema7 } from "json-schema";
import { PROPERTIES_KEY } from "./constants";
import { inferType } from "./parser/infer";
import { JSONSchema7Value } from "./utils/helper-types";
import { ChangeEventDetails, dispatchChange } from "./utils/dispatch-change";
import { AnyOfOption } from "./parser/any-of";
import { humanizeKey, humanizeValue } from "./utils/humanize";
import { choose } from "lit/directives/choose.js";
import { when } from "lit/directives/when.js";
import { isUndefined } from "lodash";

/**
 * The body represents the main content of the JSON UI.
 * It is either an object or an array.
 */

@customElement("body-element")
export class BodyElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  @property({ type: Object })
  schema?: JSONSchema7;

  @property()
  value?: any;

  render() {
    if (!this.schema) return html`<div>no schema</div>`;
    const type = inferType(this.schema!);
    return html`
      ${choose(
        type,
        [
          ["object", () => this.renderObject()],
          ["array", () => this.renderArray()],
        ],
        () => html`Unknown type ${type}`
      )}
    `;
  }

  private navigate(subPath: string) {
    this.dispatchEvent(
      new CustomEvent<string>("navigate", {
        detail: subPath,
      })
    );
  }

  private renderObject() {
    const properties = Object.entries(
      (this.schema?.[PROPERTIES_KEY] as unknown as JSONSchema7Value[]) ?? []
    );
    const required = this.schema?.required ?? [];
    return html`
      <div class="flex flex-col gap-8 items-start">
        ${properties.map(([key, prop]) => {
          const type = inferType(prop);
          const value = this.value?.[key];

          if (type === "string")
            return html`<label class="flex flex-col gap-2">
              ${renderLabel(key, required.includes(key))}
              <string-element
                @change=${dispatchChange(this, key)}
                .value=${value}
                .schema=${prop}
              ></string-element>
            </label>`;

          return html`<label class="inline-flex flex-col gap-2"
            >${renderLabel(key, required.includes(key))}
            ${this.renderValuePreview(key, value)}
          </label>`;
        })}
      </div>
    `;
  }

  private renderValuePreview(key: string, value: unknown) {
    return when(
      isUndefined(value),
      () => html`<div
        @click=${() => this.navigate(key)}
        class="cursor-pointer font-medium text-lg select-none active:bg-slate-700 text-white rounded-sm px-2 py-1 ring-slate-900 ring-2 bg-slate-900 flex gap-2 items-center"
      >
        Declare ${key}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-8 h-8"
          viewBox="0 -960 960 960"
        >
          <path
            fill="currentColor"
            d="m560-242-43-42 168-168H160v-60h525L516-681l43-42 241 241-240 240Z"
          />
        </svg>
      </div>`,
      () => html` <div
        @click=${() => this.navigate(key)}
        class="cursor-pointer font-medium text-lg select-none active:bg-stone-200 text-slate-900 rounded-sm px-2 py-1 ring-slate-900 ring-2 bg-stone-100 flex gap-2 items-center justify-between"
      >
        <div class="flex flex-col">
          ${humanizeValue(value).map(
            ([title, preview]) =>
              html`<div class="flex gap-2">
                <strong>${title}</strong
                ><span class="text-slate-500">${preview}</span>
              </div>`
          )}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-8 h-8"
          viewBox="0 -960 960 960"
        >
          <path
            fill="currentColor"
            d="M530-481 332-679l43-43 241 241-241 241-43-43 198-198Z"
          />
        </svg>
      </div>`
    );
  }

  private renderArray() {
    const itemSchema = this.schema?.items as JSONSchema7;
    if (!itemSchema) return html`<div>no item schema</div>`;
    const enumItems = itemSchema.enum;

    // Enum array.
    if (enumItems) {
      return html`
        <checkbox-group-element
          .value=${(this.value ?? []).map((val: string) =>
            enumItems.indexOf(val)
          )}
          @change=${(ev: CustomEvent<ChangeEventDetails<number[]>>) =>
            this.dispatchEvent(
              new CustomEvent<ChangeEventDetails>("change", {
                detail: {
                  value: ev.detail.value.map((i) => enumItems[i]),
                  path: "",
                },
              })
            )}
          .options=${enumItems}
        ></checkbox-group-element>
      `;
    }

    // Regular arrays.
    return html`
      <ol class="mt-4 flex flex-col gap-4">
        ${((this.value as any[]) ?? []).map(
          (value, i) => html`<li class="list-decimal ml-6 pl-4">
            ${this.renderValuePreview(i.toString(), value)}
          </li>`
        )}
        <li class="ml-6 pl-4 list-disc">
          <button
            @click="${() =>
              this.dispatchEvent(
                new CustomEvent<ChangeEventDetails>("change", {
                  detail: {
                    value: [...(this.value || []), {}],
                    path: "",
                  },
                })
              )}"
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

export const renderLabel = (
  key: string,
  required?: boolean
): TemplateResult<1> =>
  html`<div class="text-xl font-medium">
    ${humanizeKey(key)}
    ${required ? "*" : html`<span class="text-slate-500">optional</span>`}
  </div>`;
