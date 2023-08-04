import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./index.css?inline";
import { JSONSchema7 } from "json-schema";
import { schema } from "./state";
import { append } from "./utils/append";
import { rollingSelect as rollingSelector } from "./utils/mutable";
import { PROPERTIES_KEY } from "./constants";

@customElement("view-element")
export class ViewElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  @property({ type: String })
  set path(newPath: string) {
    this._path = newPath;
    this.rollingSchemaSelector.roll(newPath);
    console.log(newPath);
  }
  private _path = "";

  private rollingSchemaSelector = rollingSelector(
    schema,
    (subSchema) => (this.schema = subSchema)
  );

  @state()
  schema?: JSONSchema7;

  render() {
    switch (this.schema?.type) {
      case "object":
        return this.renderObject();
      default:
        return html`<div>Unknown type ${this.schema?.type}</div>`;
    }
  }

  renderObject() {
    const properties = Object.entries(
      (this.schema?.[PROPERTIES_KEY] as unknown as JSONSchema7[]) ?? []
    );
    return html` <div>${this._path}</div>
      <ul class="flex flex-col gap-4">
        ${properties.map(
          ([key]) =>
            html`<li
              @click=${() =>
                (this.path = append(this._path, PROPERTIES_KEY, key))}
              class="bg-slate-600 cursor-pointer active:bg-slate-800 rounded-md p-4 text-white"
            >
              ${key}
            </li>`
        )}
      </ul>`;
  }
}
