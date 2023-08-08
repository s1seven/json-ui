import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./index.css?inline";
import { resolveRefs } from "./parser/resolve-refs";
import { allOf } from "./parser/all-of";
import { path, schema, value } from "./state";
import { JSONSchema7 } from "json-schema";
import { get } from "lodash";
import { joinPaths, navigate } from "./utils/path";
import { viewManagerFactory } from "./parser/view-manager";

@customElement("json-ui-element")
export class JsonUiElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  constructor() {
    super();
    path.on((path) => {
      this.resolvedSchema = path
        ? navigate(schema.get() as JSONSchema7, path)
        : schema.get();
      console.info("schema", schema.get(), path);
    }, true);

    value.on((value) => {
      this.value = value;
    }, true);
  }

  @property({ type: Object })
  set schema(newSchema: JSONSchema7) {
    schema.set((this.resolvedSchema = allOf(resolveRefs(newSchema))));


    const viewManager = viewManagerFactory(this.resolvedSchema);
  }

  @state()
  resolvedSchema?: JSONSchema7;

  @state()
  value?: any;

  private handleChange(ev: CustomEvent<any>) {
    const resolvedPath = joinPaths(path.get(), ev.detail.path);
    console.log({ resolvedPath, value: ev.detail.value });
  }

  render() {
    if (!this.resolvedSchema) return html`<div>loading...</div>`;
    return html`
      <div class="grid grid-cols-1 gap-8">
        <view-element
          @change=${this.handleChange}
          .schema=${this.resolvedSchema}
        ></view-element>
        <code class="bg-slate-100 p-4 rounded-md block">
          <pre class="text-slate-900 text-xs"><!-- 
-->${JSON.stringify(this.value, null, 2)}</pre>
        </code>
      </div>
    `;
  }
}
