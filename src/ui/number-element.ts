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
import { isNumber } from "lodash";
import { DEFAULT_VALUES } from "../constants";

/**
 * A string.
 */

const icons: Record<string, string | TemplateResult> = {
  date: html`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16"
      viewBox="0 -960 960 960"
      width="16"
    >
      <path
        fill="currentColor"
        d="M180-80q-24 0-42-18t-18-42v-620q0-24 18-42t42-18h65v-60h65v60h340v-60h65v60h65q24 0 42 18t18 42v620q0 24-18 42t-42 18H180Zm0-60h600v-430H180v430Zm0-490h600v-130H180v130Zm0 0v-130 130Zm300 230q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"
      />
    </svg>
  `,
  email: "@",
  string: html`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16"
      viewBox="0 -960 960 960"
      width="16"
    >
      <path
        fill="currentColor"
        d="M430-160v-540H200v-100h560v100H530v540H430Z"
      />
    </svg>
  `,
};

@customElement("number-element")
export class NumberElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  @state()
  icon?: string | TemplateResult;

  @property({ type: Object })
  readonly schema!: JSONSchema7;

  @property({ type: Number })
  value?: number;

  protected willUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (_changedProperties.has("value") && !isNumber(this.value)) {
      this.value = DEFAULT_VALUES["number"]() as number;
    }
  }

  firstUpdated() {
    const format = this.schema.format as string;
    this.icon = icons[format] || icons.string;
  }

  private handleChange(ev: Event) {
    const target = ev.target as HTMLInputElement;
    const value = target.valueAsNumber;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value },
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
          class="flex rounded-sm overflow-hidden bg-white shadow-sm ring-2 border-none ring-slate-900 cursor-text focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500"
        >
          <div
            class="flex items-center justify-center px-3 bg-slate-100 border-r font-bold text-[0.8125rem] border-slate-900"
          >
            ${this.icon}
          </div>
          <input
            type="number"
            @change=${this.handleChange}
            .value=${String(this.value)}
            class="px-3 py-2 focus:ring-0 bg-transparent border-none text-[0.8125rem] focus:outline-none w-full"
          />
        </div>
      </div>
      ${this.schema.pattern
        ? html`<span class="text-sm block truncate pt-1 text-slate-500"
            >${this.schema.pattern}</span
          >`
        : ""}
    `;
  }
}

// ${errors
//   ? errors.map(
//       (error) => html`<span class="text-sm block pt-1 text-red-500"
//         >${error.message}</span
//       >`
//     )
//   : ""}
