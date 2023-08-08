import { LitElement, html, nothing, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./index.css?inline";
import { JSONSchema7 } from "json-schema";
import { anyOf, anyOfOptions } from "./parser/any-of";
import { dispatchChange } from "./utils/dispatch-change";

@customElement("any-of-element")
export class AnyOfElement extends LitElement {
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

  @state()
  indices: number[] = [];

  private handleChange(indices: number[]) {
    this.indices = indices;
    this.resolvedSchema = indices.length
      ? anyOf(this._schema as JSONSchema7, indices)
      : this._schema;
    console.log(indices, { sc: this.resolvedSchema });
  }

  render() {
    const options = anyOfOptions(this._schema!, "", this.indices);
    const anyOf = options
      ? html`
          <checkbox-group-element
            .value=${this.indices}
            @change=${(ev: CustomEvent<number[]>) =>
              this.handleChange(ev.detail)}
            .options=${options}
          ></checkbox-group-element>
          <hr />
        `
      : nothing;

    return html`<div class="flex flex-col gap-4">
      ${anyOf}
      <body-element
        @change=${dispatchChange(this)}
        .schema=${this.resolvedSchema!}
        .value=${this.value!}
      ></body-element>
    </div>`;
  }
}

// <!-- <select
// @change=${(ev: any) => this.handleChange([~~ev.target.value])}
// >
// <option value="-1">DEFAULT</option>
// ${options?.map(
//   (option, i) =>
//     html` <option
//       ?selected=${option.isSelected}
//       .value=${i.toString()}
//     >
//       ${option.title}
//     </option>`
// )}
// </select> -->
