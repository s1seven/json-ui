import { LitElement, html, nothing, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./index.css?inline";
import { ifSelectKey } from "./pure-functions/if-select-key";

/**
 * Select one string option from a list of options.
 */

@customElement("multi-dropdown-element")
export class MultiDropdownElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  @property({ type: Array })
  readonly options: string[] = [];

  @property({ type: Boolean })
  readonly searchable = false;

  @property({ type: Array })
  filteredOptions: string[] = [];

  @property({ type: Boolean })
  show = false;

  @property({ type: Array })
  value: string[] = [];

  @property({ type: String })
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
    const value = event.target.dataset.value as string;
    const idx = this.value.indexOf(value);
    idx === -1
      ? (this.value = [...this.value, value])
      : (this.value = this.value.filter((_, i) => i !== idx));
    this.dispatchEvent(new CustomEvent("value-changed", { detail: value }));
  }

  hide() {
    this.show = false;
    this.filteredOptions = this.options;
  }

  removeItem(item: string) {
    return (ev: MouseEvent) => {
      ev.stopPropagation();
      this.value = this.value.filter((v) => v !== item);
    };
  }

  render() {
    return html`
      <div
        class="relative pointer-events-auto w-full text-[0.8125rem] leading-5 text-slate-700 select-none ${this
          .show
          ? "z-10"
          : ""}"
      >
        <div
          tabindex="0"
          class="h-10 mt-2 flex items-center justify-between rounded-md  pl-1 pr-3 py-1 shadow-sm ring-1 ring-slate-700/10 cursor-default focus:outline-none focus:ring-2 focus:ring-indigo-500"
          @keydown="${ifSelectKey(() => (this.show = true))}"
          @click="${() => (this.show = true)}"
        >
          <div class="flex-1 flex items-start gap-1 h-full">
            ${(this.value || []).map(
              (val) =>
                html`
                  <div
                    class="border border-slate-400 text-slate-800 pl-2 h-full rounded-sm flex items-stretch gap-1 overflow-hidden"
                  >
                    <div class="flex items-center justify-center">${val}</div>
                    <div
                      @click="${this.removeItem(val)}"
                      class="w-6 flex items-center active:bg-slate-100 cursor-pointer justify-center "
                    >
                      <svg
                        class="h-4 w-4"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        height="48"
                        viewBox="0 -960 960 960"
                        width="48"
                      >
                        <path
                          d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"
                        />
                      </svg>
                    </div>
                  </div>
                `
            )}
          </div>
          <svg
            class="h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>

        ${this.show
          ? html`
              <div
                class="fixed inset-0 bg-transparent opacity-50"
                @click="${this.hide}"
              ></div>
              <ul
                class="absolute w-full px-0 py-2 mt-2 items-center justify-between rounded-md bg-white shadow-md ring-1 ring-slate-700/10"
              >
                ${this.searchable
                  ? html`<li class="block px-3 py-2">
                      <input
                        @input=${this.handleSearch}
                        class="w-full rounded-md px-3 py-2 shadow-sm ring-1 ring-slate-700/10"
                        placeholder="Search"
                      />
                    </li>`
                  : nothing}
                ${Array.from(this.filteredOptions).map(
                  (option) => html`<li
                    class="px-3 py-2 group outline-none flex items-center justify-between cursor-pointer"
                    tabindex="0"
                    role="option"
                    data-value="${option}"
                    @click="${this.handleSelect}"
                    @keydown="${ifSelectKey((ev) => this.handleSelect(ev))}"
                  >
                    ${option}

                    <div
                      class="w-4 h-4 pointer-events-none rounded-sm outline outline-[currentColor] flex items-center justify-center group-focus:text-indigo-600 group-hover:text-indigo-600"
                    >
                      ${this.value.includes(option)
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
                    </div>
                  </li>`
                )}
              </ul>
            `
          : nothing}
      </div>
    `;
  }
}
