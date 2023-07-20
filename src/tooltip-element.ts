import { LitElement, html, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import styles from "./index.css?inline";

/**
 * Tooltip top.
 */

@customElement("tooltip-element")
export class TooltipElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  render() {
    return html`
      <div class="inline-block relative">
        <button
          type="button"
          class="group font-medium w-5 h-5 cursor-help inline-flex justify-center items-center gap-2 rounded-full border border-gray-200 text-slate-400 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
        >
          ?
          <span
            class="group-hover:opacity-100 group-hover:visible bottom-7 opacity-0 max-w-[10rem] w-max transition-opacity block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm"
            role="tooltip"
          >
            <slot></slot>
          </span>
        </button>
      </div>
    `;
  }
}
