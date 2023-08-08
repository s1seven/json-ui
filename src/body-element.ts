import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./index.css?inline";
import { JSONSchema7 } from "json-schema";
import { PROPERTIES_KEY } from "./constants";
import { inferType } from "./parser/infer-type";
import { JSONSchema7Value } from "./utils/helper-types";
import { path } from "./state";
import { joinPaths } from "./utils/path";
import { dispatchChange } from "./utils/dispatch-change";

@customElement("body-element")
export class BodyElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  @property({ type: Object })
  schema?: JSONSchema7;

  @property()
  value?: any;

  render() {
    if (!this.schema) return html`<div>no schema</div>`;
    const type = inferType(this.schema!);

    switch (type) {
      case "object":
        return this.renderObject();
      default:
        return html`<div>Unknown type ${type}</div>`;
    }
    return html`<div class="flex flex-col gap-4">BODY</div>`;
  }

  // - properties
  // - additional fields
  private renderObject() {
    const properties = Object.entries(
      (this.schema?.[PROPERTIES_KEY] as unknown as JSONSchema7Value[]) ?? []
    );
    const required = this.schema?.required ?? [];

    return html`
      <!-- <div class="grid grid-cols-2 gap-8"> -->
      <ul class="flex flex-col gap-4">
        ${properties.map(([key, value]) => {
          const type = inferType(value);

          if (type === "string")
            return html` <string-element
              @change=${dispatchChange(this, key)}
              .schema=${this.schema}
            ></string-element>`;

          return html`<li
            @click=${() => path.set(joinPaths(path.get(), key))}
            class="bg-slate-100 cursor-pointer ring-1 active:bg-slate-800 rounded-md p-4 text-slate-900"
          >
            <small>${type}</small>: ${key}
            ${required.includes(key)
              ? html`<span class="text-red-500">*</span>`
              : ""}
          </li>`;
        })}
      </ul>

      <!-- <code class="bg-slate-100 p-4 rounded-md block">
          <pre class="text-slate-900 text-xs">
${JSON.stringify(this.schema, null, 2)}</pre>
        </code>
      </div> -->
    `;
  }
}
