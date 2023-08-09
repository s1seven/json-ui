import { LitElement, TemplateResult, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "../index.css?inline";
import { ChangeEventDetails } from "../utils/dispatch-change";

/**
 * Checkbox group element.
 */

@customElement("checkbox-group-element")
export class CheckboxGroupElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  @property({ type: Array })
  readonly options: (string | TemplateResult) [] = [];

  @property({ type: Array })
  readonly value: number[] = [];

  private handleChange(ev: Event) {
    const target = ev.target as HTMLInputElement;
    const value = ~~target.value;
    const set = new Set([...this.value]);
    if (target.checked) set.add(value);
    else set.delete(value);
    this.dispatchEvent(
      new CustomEvent<ChangeEventDetails<number[]>>("change", {
        detail: {
          path: "",
          value: [...set],
        },
      })
    );
  }

  render() {
    return html`<span class="text-slate-800">Select at least 1 item.</span>
      <ul class="flex flex-col gap-4 mt-4">
        ${this.options.map(
          (option, i) => html`
            <li>
              <label class="flex gap-4 items-center">
                <input
                  ?checked=${this.value.includes(i)}
                  value=${i}
                  @change=${this.handleChange}
                  type="checkbox"
                  class="w-5 h-5 shrink-0 [&:checked]:ring-blue-600 ring-2 border-none ring-slate-900 rounded-sm text-blue-600 focus:ring-blue-500"
                />
                <span>${option}</span>
              </label>
            </li>
          `
        )}
      </ul>`;
  }
}
