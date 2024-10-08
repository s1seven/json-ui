import { LitElement, html, nothing, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "../index.css?inline";
import { ifSelectKey } from "../utils/if-select-key";
import { icons } from "./icons";

/**
 * Select one string option from a list of options.
 * dispatches:
 * - value-changed (string)
 */

@customElement("single-dropdown-element")
export class SingleDropdownElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  @property({ type: Array })
  readonly options: string[] = [];

  @property({ type: Boolean })
  readonly searchable = false;

  @property({ type: String })
  value = this.options[0];

  @state()
  filteredOptions: string[] = [];

  @state()
  show = false;

  @state()
  searchValue = "";

  firstUpdated() {
    this.filteredOptions = this.options;
  }

  handleSearch(event: any) {
    const value = event.target.value;
    this.filteredOptions = this.options
      .filter((option) => option.includes(value))
      .sort((a, b) => a.indexOf(value) - b.indexOf(value));
  }

  handleSelect(event: any) {
    const value = event.target.dataset.value;
    this.value = value;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value },
      })
    );

    this.hide();
  }

  hide() {
    this.show = false;
    this.filteredOptions = this.options;
  }

  render() {
    return html`
      <div
        class="relative pointer-events-auto w-full text-[0.8125rem] leading-5 text-slate-800 select-none ${this
          .show
          ? "z-10"
          : ""}"
      >
        <button-element
          @click="${() => (this.show = !this.show)}"
          .icon=${icons.EXPAND_ALL()}
          size="s"
          >${this.value || html`&nbsp;`}</button-element
        >

        ${this.show
          ? html`
              <div
                class="fixed inset-0 bg-transparent opacity-50"
                @click="${this.hide}"
              ></div>
              <ul
                class="absolute w-full px-0 py-2 mt-2 items-center justify-between rounded-sm bg-white shadow-md ring-1 ring-slate-700/10"
              >
                ${this.searchable
                  ? html`<li class="block px-3 py-2">
                      <input
                        @input=${this.handleSearch}
                        class="w-full rounded-sm px-3 py-2 shadow-sm ring-1 ring-slate-700/10"
                        placeholder="Search"
                      />
                    </li>`
                  : nothing}
                ${Array.from(this.filteredOptions).map(
                  (option) => html`<li
                    class="px-3 py-2 focus:bg-indigo-600 focus:text-white hover:text-white hover:bg-indigo-600 outline-none flex items-center justify-between"
                    tabindex="0"
                    role="option"
                    data-value="${option}"
                    @click="${this.handleSelect}"
                    @keydown="${ifSelectKey((ev) => this.handleSelect(ev))}"
                  >
                    ${option}
                    ${this.value === option
                      ? html`<svg
                          class="w-5 h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                          class="nu rw"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>`
                      : nothing}
                  </li>`
                )}
              </ul>
            `
          : nothing}
      </div>
    `;
  }
}
