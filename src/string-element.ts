import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./index.css?inline";

/**
 * A string.
 */

@customElement("string-element")
export class StringElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  @property({ type: String })
  value = "";

  handleChange(event: any) {
    const value = event.target.value;
    this.value = value;
    this.dispatchEvent(new CustomEvent("value-changed", { detail: value }));
  }

  render() {
    return html`
      <div
        class="relative pointer-events-auto w-[28.125rem] text-[0.8125rem] leading-5 text-slate-700 select-none mt-2"
      >
        <div class=" ">
          <input
            @input=${this.handleChange}
            class="rounded-md bg-white px-3 py-2 shadow-sm ring-1 ring-slate-700/10 cursor-text focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
          />
        </div>
      </div>
    `;
  }
}
