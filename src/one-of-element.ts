import { LitElement, html, nothing, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./index.css?inline";
import { oneOf, oneOfOptions } from "./parser/one-of";
import { JSONSchema7 } from "json-schema";
import { dispatchChange } from "./utils/dispatch-change";

@customElement("one-of-element")
export class OneOfElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  @property({ type: Object })
  set schema(schema: JSONSchema7) {
    this.resolvedSchema = this._schema = schema;
  }

  private _schema?: JSONSchema7;

  @property()
  value?: any;

  @state()
  resolvedSchema?: JSONSchema7;

  private handleChange(index: number) {
    this.resolvedSchema =
      index === -1 ? this._schema : oneOf(this._schema as JSONSchema7, index);
  }

  render() {
    const options = oneOfOptions(this._schema, "", -1);
    const oneOf = options
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

    return html`<div class="flex flex-col gap-4">
      ${oneOf}
      <any-of-element
        @change=${dispatchChange(this)}
        .schema=${this.resolvedSchema!}
        .value=${this.value!}
      ></any-of-element>
    </div>`;
  }
}
