import { LitElement, PropertyValueMap, html, nothing, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./index.css?inline";
import { resolveRefs } from "./parser/resolve-refs";
import { allOf } from "./parser/all-of";
import { JSONSchema7 } from "json-schema";
import { joinPaths, navigateSchema } from "./utils/path";
import { inferOneOfOption, oneOf } from "./parser/one-of";
import { anyOf, inferAnyOfOptions } from "./parser/any-of";
import { get, isEmpty, isNull, isUndefined, set } from "lodash";
import { inferDescription, inferTitle, inferType } from "./parser/infer";
import { ROOT_PATH, DEFAULT_VALUES, PATH_SEPARATOR } from "./constants";
import { ChangeEventDetails } from "./utils/dispatch-change";
import { humanizeKey } from "./utils/humanize";
import { ajvFactory } from "./parser/ajv";
import { ValidateFunction } from "ajv";

@customElement("json-ui-element")
export class JsonUiElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  @property({ type: Object })
  schema!: JSONSchema7;

  @property({ type: Object })
  value?: any;

  @state()
  path = ROOT_PATH;

  @state()
  resolvedSchemas!: Record<
    | "resolvedRefs"
    | "resolvedAllOf"
    | "navigated"
    | "resolvedOneOf"
    | "resolvedAnyOf",
    JSONSchema7
  >;

  @state()
  ajvValidateFn?: ValidateFunction;

  @state()
  oneOfIndex = 0;

  @state()
  anyOfIndices?: number[];

  @state()
  resolvedValue?: any;

  protected shouldUpdate(): boolean {
    return !isUndefined(this.schema);
  }

  protected willUpdate(
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    this.resolvedSchemas ??= {} as any;

    // Always resolve the value because nested values may have changed.
    this.resolvedValue = this.path ? get(this.value, this.path) : this.value;

    if (this.schema && this.ajvValidateFn) this.ajvValidateFn!(this.value);

    // Determine the depth of changes to optimize the schema resolution process.
    // Note: oneOf and anyOf are currently only supported at the top level!
    const updateLevel = [
      "schema",
      "path",
      "oneOfIndex",
      "anyOfIndices",
    ].findIndex((prop) => changedProperties.has(prop));

    if (updateLevel === -1) {
      this.dispatchEvent(new CustomEvent("change", { detail: this.value }));
      console.debug(`🛠️ [DEBUG] No schema update required.`, {
        changedProperties,
      });
      return;
    }

    console.debug(
      `${
        ["🔴", "🟠", "🟡", "🟢"][updateLevel]
      } [DEBUG] Performing a level ${updateLevel} schema update.`
    );

    if (updateLevel === 0) {
      this.ajvValidateFn = ajvFactory().compile(this.schema);
      this.ajvValidateFn!(this.value);
      this.resolvedSchemas.resolvedRefs = resolveRefs(this.schema);
      this.resolvedSchemas.resolvedAllOf = allOf(
        this.resolvedSchemas.resolvedRefs
      );
    }

    if (updateLevel <= 1) {
      const navigatedSchema = navigateSchema(
        this.resolvedSchemas.resolvedAllOf,
        this.path,
        this.value
      );

      if (isUndefined(navigatedSchema)) {
        this.path = ROOT_PATH;
        this.resolvedValue = get(this.value, this.path);
        this.resolvedSchemas.navigated = this.resolvedSchemas.resolvedAllOf;
      } else {
        this.resolvedSchemas.navigated = navigatedSchema;
      }

      this.dispatchEvent(new CustomEvent("navigate", { detail: this.path }));

      this.oneOfIndex = inferOneOfOption(
        this.resolvedSchemas.navigated,
        this.resolvedValue
      )[0];
    }

    if (updateLevel <= 2) {
      this.resolvedSchemas.resolvedOneOf =
        this.oneOfIndex !== -1
          ? oneOf(this.resolvedSchemas.navigated, this.oneOfIndex)
          : this.resolvedSchemas.navigated;

      this.anyOfIndices = inferAnyOfOptions(
        this.resolvedSchemas.resolvedOneOf,
        this.resolvedValue
      );
    }

    if (updateLevel <= 3) {
      this.resolvedSchemas.resolvedAnyOf = !isEmpty(this.anyOfIndices)
        ? anyOf(this.resolvedSchemas.resolvedOneOf!, this.anyOfIndices!)
        : this.resolvedSchemas.resolvedOneOf;
    }
  }

  private handleChange(ev: CustomEvent<any>) {
    const resolvedPath = joinPaths(this.path, ev.detail.path);
    const expectedRootType = inferType(this.schema, this.value);
    if (expectedRootType === void 0)
      throw new Error("Could not determine base schema type.");
    if (
      typeof this.value !== expectedRootType ||
      isNull(this.value) ||
      isUndefined(this.value)
    )
      this.value = DEFAULT_VALUES[expectedRootType]();

    set(this.value, resolvedPath, ev.detail.value);
    this.requestUpdate();
  }

  render() {
    console.debug(`🧠 [DEBUG] Rendering JSON UI.`, this.resolvedSchemas);
    const { resolvedAnyOf, navigated, resolvedOneOf } = this.resolvedSchemas;

    return html`
      <div class="grid grid-cols-1 gap-8">
        ${this.renderHeader()}
        ${navigated.oneOf &&
        html`<one-of-element
          @change=${(ev: CustomEvent<number>) => (this.oneOfIndex = ev.detail)}
          .schema=${navigated}
          .value=${this.oneOfIndex}
        ></one-of-element>`}
        ${resolvedOneOf.anyOf &&
        html`<any-of-element
          @change=${(ev: CustomEvent<ChangeEventDetails<number[]>>) =>
            (this.anyOfIndices = ev.detail.value)}
          .schema=${navigated}
          .value=${this.anyOfIndices}
        ></any-of-element>`}

        <body-element
          @change=${this.handleChange}
          @navigate=${(ev: CustomEvent<string>) =>
            (this.path = joinPaths(this.path, ...ev.detail))}
          .schema=${resolvedAnyOf}
          .value=${this.resolvedValue}
          .path=${this.path}
        ></body-element>

        ${this.renderNextButton()}
      </div>
    `;
  }

  private renderHeader() {
    const schema = this.resolvedSchemas.resolvedAnyOf;
    const title = inferTitle(schema, this.path);
    const description = inferDescription(schema);

    const pathParts = this.path.split(PATH_SEPARATOR);
    return html`
      <div class="flex flex-col gap-8">
        <div class="flex gap-2 items-center select-none text-slate-800">
          ${pathParts.map(
            (part, i, arr) =>
              html`<a
                  class="cursor-pointer p-0.5 inline-block rounded-sm active:text-slate-500 underline underline-offset-4"
                  @click=${() =>
                    (this.path = pathParts
                      .filter((_, k) => k <= i)
                      .join(PATH_SEPARATOR))}
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

  // private renderErrors() {
  //   const errors = this.ajvValidateFn?.errors ?? [];
  //   return html`
  //     <div class="hidden flex flex-col p-8 ring-2 ring-red-500 gap-4">
  //       ${errors.map(
  //         (e) =>
  //           html`<div class="text-red-500 flex flex-col">
  //             ${humanizeValue(e).map(
  //               ([key, val]) =>
  //                 html` <div><strong>${key}</strong>: ${val}</div> `
  //             )}
  //           </div>`
  //       )}
  //     </div>
  //   `;
  // }

  private renderNextButton() {
    return nothing;
    // return html` <button>HIII</button> `;
  }
}
