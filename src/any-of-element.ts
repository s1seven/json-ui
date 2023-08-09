import { LitElement, html, nothing, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./index.css?inline";
import { JSONSchema7 } from "json-schema";
import { anyOfOptions } from "./parser/any-of";

@customElement("any-of-element")
export class AnyOfElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  @property({ type: Object })
  schema!: JSONSchema7;

  @property({ type: String })
  path!: string;

  @property({ type: Array })
  value?: number[];

  private handleChange(indices: number[]) {
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: indices,
      })
    );
  }

  render() {
    const options = anyOfOptions(
      this.schema!,
      this.path!,
      this.value ?? []
    )?.map((option) => option.title);

    console.log({ options }, this.schema, this.path, this.value);

    return options
      ? html`
          <checkbox-group-element
            .value=${this.value ?? []}
            @change=${(ev: CustomEvent<number[]>) =>
              this.handleChange(ev.detail)}
            .options=${options}
          ></checkbox-group-element>
        `
      : nothing;
  }
}
