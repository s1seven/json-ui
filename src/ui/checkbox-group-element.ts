import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "../index.css?inline";
import { AnyOfOption } from "../parser/any-of";

/**
 * Checkbox group element.
 */

@customElement("checkbox-group-element")
export class CheckboxGroupElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  @property({ type: Array })
  readonly options: AnyOfOption[] = [];

  @property({ type: Array })
  readonly value: number[] = [];

  private handleChange(ev: Event) {
    const target = ev.target as HTMLInputElement;
    const value = ~~target.value;
    const set = new Set([...this.value]);
    if (target.checked) set.add(value);
    else set.delete(value);
    console.log(set);
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: [...set],
      })
    );
  }

  render() {
    return html`Choose at least one:
      <ul class="flex flex-col gap-4">
        ${this.options.map(
          ({ title, isSelected, isIllogicalAfterToggle }, i) => html`
            <li class="flex gap-4">
              <input
                ?disabled=${isIllogicalAfterToggle}
                ?checked=${isSelected}
                value=${i}
                @change=${this.handleChange}
                type="checkbox"
                class="shrink-0 mt-1 border-gray-200 rounded text-blue-600 focus:ring-blue-500"
              />
              <span>${title} ${isIllogicalAfterToggle}</span>
            </li>
          `
        )}
      </ul>`;
  }
}
