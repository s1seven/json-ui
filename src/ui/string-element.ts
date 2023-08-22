import {
  LitElement,
  PropertyValueMap,
  TemplateResult,
  html,
  unsafeCSS,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "../index.css?inline";
import { JSONSchema7 } from "json-schema";
import { isString } from "lodash";
import { DEFAULT_VALUES } from "../constants";
import { icons } from ".";
import { when } from "lit/directives/when.js";

@customElement("string-element")
export class StringElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  @state()
  icon?: string | TemplateResult;

  @property({ type: Object })
  readonly schema!: JSONSchema7;

  @property({ type: String })
  value: string | undefined;

  protected willUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (_changedProperties.has("value") && !isString(this.value)) {
      this.value = DEFAULT_VALUES["string"]() as string;
    }
  }

  firstUpdated() {
    // const format = this.schema.format as string;
    // this.icon = icons[format] || icons.string;
    // const inputEl = this.shadowRoot?.querySelector("input") as HTMLInputElement;
    // if (format === "date") {
    //   IMask(inputEl, {
    //     mask: "YYYY-MM-DD",
    //     blocks: {
    //       YYYY: {
    //         mask: IMask.MaskedRange,
    //         from: 1900,
    //         to: 2099,
    //       },
    //       MM: {
    //         mask: IMask.MaskedRange,
    //         from: 1,
    //         to: 12,
    //       },
    //       DD: {
    //         mask: IMask.MaskedRange,
    //         from: 1,
    //         to: 31,
    //       },
    //     },
    //     lazy: false,
    //   });
    // } else if (format === "email") {
    //   IMask(inputEl, {
    //     mask: /^\S*@?\S*$/,
    //     lazy: false,
    //   });
    // }
  }

  private handleChange(ev: Event) {
    const target = ev.target as HTMLInputElement;
    const value = target.value;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value },
      })
    );
  }

  private clearValue() {
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: void 0 },
      })
    );
  }

  validate() {
    // const validate = ajv.compile(this.schema);
    // return validate(this.value) ? void 0 : validate.errors;
    return void 0;
  }

  render() {
    // const errors = this.validate();
    return html`
      <div
        class="relative pointer-events-auto w-full text-slate-800 select-none"
      >
        <div
          class="flex overflow-hidden items-center bg-white shadow-sm ring-1 box-border border-none ring-slate-400 cursor-text focus-within:outline-none focus-within:ring-2 focus-within:ring-slate-500"
        >
          <!-- <div
            class="flex items-center justify-center px-3 bg-slate-100 border-r font-bold text-[0.8125rem] border-slate-900"
          >
            ${this.icon}
          </div> -->
          <input
            type="text"
            @change=${this.handleChange}
            .value=${this.value ?? ""}
            class="px-3 py-2 focus:ring-0 bg-transparent border-none text-base focus:outline-none w-full"
          />
          ${when(
            this.value,
            () => html`<button-element
              class="pr-2"
              size="xs"
              .icon=${icons.CLOSE()}
              @click=${() => this.clearValue()}
            ></button-element>`
          )}
        </div>
      </div>
    `;
  }
}

// <!-- ${this.schema.pattern
//   ? html`<span class="text-sm block truncate pt-1 text-slate-500"
//       >${this.schema.pattern}</span
//     >`
//   : ""} -->
// ${errors
//   ? (errors ?? []).map(
//       (error: any) => html`<span class="text-sm block pt-1 text-red-500"
//         >${error.message}</span
//       >`
//     )
//   : ""}
