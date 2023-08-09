import { LitElement, html, nothing, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./index.css?inline";
import { resolveRefs } from "./parser/resolve-refs";
import { allOf } from "./parser/all-of";
import { JSONSchema7 } from "json-schema";
import { joinPaths, navigate } from "./utils/path";
import { oneOf } from "./parser/one-of";
import { anyOf } from "./parser/any-of";
import { get, set } from "lodash";
import { inferDescription, inferTitle } from "./parser/infer";
import { PATH_SEPARATOR } from "./constants";
import { ChangeEventDetails } from "./utils/dispatch-change";
import { humanizeKey } from "./utils/humanize";

@customElement("json-ui-element")
export class JsonUiElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  constructor() {
    super();
  }

  @property({ type: Object })
  schema?: JSONSchema7;

  @state()
  oneOfIndex?: number;

  @state()
  anyOfIndices?: number[];

  @state()
  path = "";

  @property({ type: Object })
  value?: any = {
    RefSchemaUrl: "loremmmm",
  };

  private setPath(path: string) {
    this.anyOfIndices = void 0;
    this.oneOfIndex = void 0;
    this.path = path;
  }

  private resolveSchema(): JSONSchema7 | undefined {
    if (!this.schema) return void 0;
    let schema = allOf(resolveRefs(this.schema));
    if (this.path) schema = navigate(schema, this.path);
    if (this.oneOfIndex !== undefined) schema = oneOf(schema, this.oneOfIndex);
    if (this.anyOfIndices && this.anyOfIndices.length > 0)
      schema = anyOf(schema, this.anyOfIndices);
    return schema;
  }

  private resolveValue(): any {
    if (this.path) return get(this.value, this.path);
    return this.value;
  }

  private handleChange(ev: CustomEvent<any>) {
    const resolvedPath = joinPaths(this.path, ev.detail.path);
    set(this.value, resolvedPath, ev.detail.value);
    this.requestUpdate();
  }

  render() {
    const resolvedSchema = this.resolveSchema();
    if (!resolvedSchema) return nothing;
    const resolvedValue = this.resolveValue();

    return html`
      <div class="grid grid-cols-1 gap-8">
        ${this.renderHeader(resolvedSchema)}
        ${resolvedSchema.oneOf &&
        html`<one-of-element
          @change=${(ev: CustomEvent<number>) => (this.oneOfIndex = ev.detail)}
          .schema=${resolvedSchema}
          .value=${this.oneOfIndex}
        ></one-of-element>`}
        ${resolvedSchema.anyOf &&
        html`<any-of-element
          @change=${(ev: CustomEvent<ChangeEventDetails<number[]>>) =>
            (this.anyOfIndices = ev.detail.value)}
          .schema=${resolvedSchema}
          .value=${this.anyOfIndices}
        ></any-of-element>`}

        <body-element
          @change=${this.handleChange}
          @navigate=${(ev: CustomEvent<string>) =>
            this.setPath(joinPaths(this.path, ev.detail))}
          .schema=${resolvedSchema}
          .value=${resolvedValue}
        ></body-element>

        ${this.renderNextButton()}
      </div>
    `;
  }

  private renderHeader(schema: JSONSchema7) {
    const title = inferTitle(schema, this.path);
    const description = inferDescription(schema);

    const pathParts = this.path.split(PATH_SEPARATOR);
    return html`
      <div class="flex flex-col gap-8">
        <div class="border-b border-black">
          <button
            class="text-blue-500"
            @click=${() => {
              pathParts?.pop();
              this.setPath(pathParts?.join(PATH_SEPARATOR));
            }}
          >
            Back
          </button>
        </div>
        <div class="flex gap-2">
          ${pathParts.map(
            (part, i, arr) =>
              html`<a
                  @click=${() =>
                    this.setPath(
                      pathParts.filter((_, k) => k <= i).join(PATH_SEPARATOR)
                    )}
                  >${part}</a
                >${i < arr.length - 1 ? html`›` : nothing}`
          )}
        </div>
        <div class="flex flex-col gap-4">
          <h1 class="text-4xl font-bold">${humanizeKey(title)}</h1>
          <p class="text-base text-slate-800">${description}</p>
        </div>
      </div>
    `;
  }

  private renderNextButton() {
    return nothing;
    // return html` <button>HIII</button> `;
  }
}
