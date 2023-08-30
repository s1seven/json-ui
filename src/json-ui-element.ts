import {
  LitElement,
  PropertyValueMap,
  css,
  html,
  nothing,
  unsafeCSS,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./index.css?inline";
import { resolveRefs } from "./parser/resolve-refs";
import { allOf } from "./parser/all-of";
import { JSONSchema7 } from "json-schema";
import { joinPaths, navigateSchema } from "./utils/path";
import { inferOneOfOption, oneOf } from "./parser/one-of";
import { anyOf, inferAnyOfOptions } from "./parser/any-of";
import { clone, get, isEmpty, isNull, isUndefined, set } from "lodash";
import { inferDescription, inferTitle, inferType } from "./parser/infer";
import {
  ROOT_PATH,
  DEFAULT_VALUES,
  PATH_SEPARATOR,
  PATH_UP,
} from "./constants";
import { ChangeEventDetails } from "./utils/dispatch-change";
import { humanizeKey } from "./utils/humanize";
import { ajvFactory } from "./parser/ajv";
import { ValidateFunction } from "ajv";
import { icons } from "./ui";
import { highlightPath } from ".";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { when } from "lit/directives/when.js";

@customElement("json-ui-element")
export class JsonUiElement extends LitElement {
  static readonly styles = [
    unsafeCSS(styles),
    css`
      :host .panel {
        transition: width 200ms cubic-bezier(0.4, 0, 0.2, 1),
          opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 60ms;
      }
      :host .json-ui-highlight {
        font-weight: bold;
        color: blue;
        outline: 1px solid blue;
      }
    `,
  ];

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

    // Handle invalid root type.
    const expectedRootType = inferType(this.schema, this.value);
    if (expectedRootType === void 0)
      throw new Error("Could not determine base schema type.");
    if (
      // TODO: Some types cannot be inferred from value, e.g. integer.
      inferType(void 0, this.value) !== expectedRootType ||
      isNull(this.value) ||
      isUndefined(this.value)
    ) {
      this.value = DEFAULT_VALUES[expectedRootType]();
      this.dispatchEvent(new CustomEvent("change", { detail: this.value }));
    } else if (changedProperties.has("value")) {
      this.dispatchEvent(new CustomEvent("change", { detail: this.value }));
    }

    // Always resolve the value because nested values may have changed.
    this.resolvedValue = clone(
      this.path ? get(this.value, this.path) : this.value
    );

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

      // Navigation failed.
      if (isUndefined(navigatedSchema)) {
        this.path = ROOT_PATH;
        this.resolvedValue = clone(get(this.value, this.path));
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

    console.log(
      inferOneOfOption(this.resolvedSchemas.navigated, this.resolvedValue)[0]
    );

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

    if (resolvedPath) {
      const newValue = structuredClone(this.value);
      set(newValue, resolvedPath, ev.detail.value);
      this.value = newValue;
    } else {
      this.value = ev.detail.value;
    }
  }

  private toggleSidebar() {
    const sidebar = this.shadowRoot?.getElementById("sidebar")!;
    sidebar.hasAttribute("data-show")
      ? sidebar.removeAttribute("data-show")
      : sidebar.setAttribute("data-show", "");
  }

  render() {
    console.debug(
      `🧠 [DEBUG] Rendering JSON UI.`,
      this.resolvedSchemas,
      this.resolvedValue
    );
    const { resolvedAnyOf, navigated, resolvedOneOf } = this.resolvedSchemas;

    console.log({ resolvedAnyOf });

    return html`
      <div class="flex relative gap-0 items-stretch">
        <div class="w-full">
          <div class="grid grid-cols-1 gap-8 flex-1">
            ${this.renderHeader()}
            ${when(
              navigated.oneOf,
              () => html`<one-of-element
                @change=${(ev: CustomEvent<number>) =>
                  (this.oneOfIndex = ev.detail)}
                .schema=${navigated}
                .value=${this.oneOfIndex}
              ></one-of-element>`
            )}
            ${when(
              resolvedOneOf.anyOf,
              () => html`<any-of-element
                @change=${(ev: CustomEvent<ChangeEventDetails<number[]>>) =>
                  (this.anyOfIndices = ev.detail.value)}
                .schema=${navigated}
                .value=${this.anyOfIndices}
              ></any-of-element>`
            )}

            <body-element
              @change=${this.handleChange}
              @navigate=${(ev: CustomEvent<string>) =>
                (this.path = joinPaths(this.path, ...ev.detail))}
              .schema=${resolvedAnyOf}
              .value=${this.resolvedValue}
              .path=${this.path}
            ></body-element>
          </div>
        </div>
        <div>
          <div
            id="sidebar"
            class="panel sticky top-4 opacity-0 w-0 overflow-hidden [&[data-show]]:opacity-100 [&[data-show]]:w-[16rem] flex-[0_0] flex justify-end"
          >
            <div class="right-0 flex-[0_0_16rem]">
              <div
                class="ml-4 border border-slate-400 rounded-sm p-4 box-border text-xs text-slate-800"
              >
                <pre
                  class="max-w-[420px] overflow-auto"
                ><code class="break-all whitespace-pre-wrap">${unsafeHTML(
                  highlightPath(this.value, this.path)
                )}</code></pre>
                <button-element
                  class="mt-4"
                  @click=${() => (this.value = void 0)}
                  size="xs"
                  >Clear</button-element
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderHeader() {
    const schema = this.resolvedSchemas.resolvedAnyOf;
    const title = inferTitle(schema, this.path);
    const description = inferDescription(schema);

    const pathParts = ["", ...this.path.split(PATH_SEPARATOR).filter(Boolean)];
    return html`
      <div class="flex flex-col gap-8">
        <div class="flex gap-2 items-center select-none text-slate-800">
          ${pathParts.map(
            (part, i, arr) =>
              html`<a
                  class="cursor-pointer p-0.5 inline-block rounded-sm active:text-slate-500 hover:underline underline-offset-4"
                  @click=${() =>
                    (this.path = joinPaths(
                      this.path,
                      ...new Array(arr.length - i - 1).fill(PATH_UP)
                    ))}
                  >${part || "Root"}</a
                >${i < arr.length - 1 ? html`›` : nothing}`
          )}
          <span class="flex-1"></span>
          <button-element
            @click=${() => this.toggleSidebar()}
            size="xs"
            .project=${false}
            .iconLeft=${icons.DATA()}
          ></button-element>
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
}
