import { LitElement, html, nothing, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./index.css?inline";
import { oneOfOptions } from "./parser/one-of";
import { JSONSchema7 } from "json-schema";


// Certificate › Parties › Manufacturer
// x make sure select does not disappear
// 2. infer selection from value

@customElement("one-of-element")
export class OneOfElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  @property({ type: Object })
  schema!: JSONSchema7;

  @property()
  value?: any;

  private handleChange(index: number) {
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: index,
      })
    );
  }

  render() {
    const options = oneOfOptions(this.schema, "", this.value);
    return options
      ? html`
          <select @change=${(ev: any) => this.handleChange(~~ev.target.value)}>
            <option value="-1">DEFAULT</option>
            ${options?.map(
              (option, i) =>
                html` <option
                  ?selected=${option.isSelected}
                  .value=${i.toString()}
                >
                  ${option.title}
                </option>`
            )}
          </select>
          <hr />
        `
      : nothing;
  }
}
