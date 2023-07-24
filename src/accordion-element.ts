import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./index.css?inline";
import { ifSelectKey } from "./pure-functions/if-select-key";

@customElement("accordion-element")
export class AccordionElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  @property({ type: Boolean }) isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  render() {
    return html`
      <div
        class="cursor-default group flex justify-between items-center pb-4 pr-2 focus:outline-none"
        @click=${this.toggle}
        @keydown="${ifSelectKey(() => this.toggle())}"
        tabindex="0"
      >
        <slot name="header"></slot>
        <svg
          class="${this.isOpen
            ? "transform rotate-180"
            : ""} block w-3 h-3 p-1 box-content rounded-full flex-none text-gray-600 group-hover:text-gray-500 transition-all group-focus:ring-2 group-focus:ring-indigo-500"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          ></path>
        </svg>
      </div>
      <div class="${this.isOpen ? "max-h-[auto]" : "max-h-0 overflow-hidden"}">
        <slot name="content"></slot>
      </div>
    `;
  }
}
