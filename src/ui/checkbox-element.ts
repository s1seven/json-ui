import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "../index.css?inline";
import { ChangeEventDetails } from "../utils/dispatch-change";

/**
 * Checkbox element.
 */

@customElement("checkbox-element")
export class CheckboxElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  @property({ type: Boolean })
  readonly value: boolean = false;

  @property({ type: String })
  readonly label: string = "";

  private handleChange(ev: Event) {
    const target = ev.target as HTMLInputElement;
    const value = target.checked;
    this.dispatchEvent(
      new CustomEvent<ChangeEventDetails<boolean>>("change", {
        detail: {
          path: "",
          value,
        },
      })
    );
  }

  render() {
    return html`
      <label class="flex gap-4 items-center">
        <input
          ?checked=${this.value}
          @change=${this.handleChange}
          type="checkbox"
          class="w-5 h-5 shrink-0 [&:checked]:ring-blue-600 ring-2 border-none ring-slate-900 rounded-sm text-blue-600 focus:ring-blue-500"
        />
        <span>${this.label}</span>
      </label>
    `;
  }
}
