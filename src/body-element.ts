import {
  LitElement,
  PropertyValueMap,
  TemplateResult,
  html,
  nothing,
  unsafeCSS,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./index.css?inline";
import { JSONSchema7 } from "json-schema";
import {
  ADDITIONAL_PROPERTIES_KEY,
  DEFAULT_VALUES,
  PROPERTIES_KEY,
  PRIMITIVE_TYPES,
  ALL_TYPES,
  PATH_UP,
} from "./constants";
import { inferType } from "./parser/infer";
import { JSONSchema7Value } from "./utils/helper-types";
import { ChangeEventDetails, dispatchChange } from "./utils/dispatch-change";
import { humanizeKey, humanizeValue } from "./utils/humanize";
import { choose } from "lit/directives/choose.js";
import { when } from "lit/directives/when.js";
import { get, isEmpty, isEqual, isUndefined, slice, uniq } from "lodash";
import { PathSegment, navigateSchema } from "./utils/path";
import { icons } from "./ui/icons";
import { ButtonEmphasis } from "./ui/button-element";
import { Falsy } from "./utils/falsy";
import { ajvFactory } from "./parser/ajv";

/**
 * The body represents the main content of the JSON UI.
 * It is either an object or an array.
 */

@customElement("body-element")
export class BodyElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  @property({ type: Object })
  schema?: JSONSchema7;

  @property()
  value?: any;

  @property({ type: String })
  readonly path?: string;

  @state()
  required: string[] = [];

  protected willUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    this.required = this.schema?.required ?? [];
  }

  private renderBackButton = (
    emphasis: ButtonEmphasis = "high",
    hasArrow = true
  ) =>
    when(
      this.path,
      () => html`<button-element
        @click=${() => this.navigate(PATH_UP)}
        size="m"
        .emphasis=${emphasis}
        .iconLeft=${hasArrow ? icons.ARROW_LEFT() : void 0}
        >Back</button-element
      >`
    );

  render() {
    if (!this.schema) return html`<div>no schema</div>`;
    const type = inferType(this.schema!, this.value);
    return html`
      ${choose(
        type,
        [
          [
            "object",
            () =>
              this.renderObject(
                Object.entries(
                  (this.schema?.[
                    PROPERTIES_KEY
                  ] as unknown as JSONSchema7Value[]) ?? []
                ).map(([key, prop]) => [
                  key,
                  inferType(prop, this.value?.[key]),
                ])
              ),
          ],
          ["array", () => this.renderArray()],
          ["string", () => this.renderPrimitive("string")],
          ["number", () => this.renderPrimitive("number")],
          ["enum", () => this.renderPrimitive("enum")],
          ["boolean", () => this.renderPrimitive("boolean")],
        ],
        () => html`Unknown type <strong>${type}</strong>.`
      )}
      <div class="h-8"></div>
      ${when(type !== "object", () => this.renderBackButton())}
    `;
  }

  private navigate(...segments: PathSegment[]) {
    this.dispatchEvent(
      new CustomEvent<PathSegment[]>("navigate", {
        detail: segments,
      })
    );
  }

  private renderPrimitive(
    type: (typeof PRIMITIVE_TYPES)[number],
    key?: string | number,
    skipHeader = false
  ) {
    const value = !isUndefined(key) ? this.value?.[key] : this.value;
    const schema = navigateSchema(this.schema!, key);

    return html`<label id="#${key}" class="flex flex-col gap-2 w-full">
      ${when(!skipHeader && key, () =>
        renderLabel(String(key), this.required.includes(String(key)))
      )}
      ${choose(type, [
        [
          "string",
          () => html`<string-element
            @change=${dispatchChange(this, String(key ?? ""))}
            .value=${value}
            .schema=${schema}
          ></string-element>`,
        ],
        [
          "number",
          () => html`<number-element
            @change=${dispatchChange(this, String(key ?? ""))}
            .value=${value}
            .schema=${schema}
          ></number-element>`,
        ],
        [
          "enum",
          () => {
            const enumOptions = ((schema?.enum as any[]) ?? []).map((item) =>
              String(item)
            );
            return html`<single-dropdown-element
              @change=${dispatchChange(this, String(key ?? ""))}
              .options=${enumOptions}
              .value=${value}
            ></single-dropdown-element>`;
          },
        ],
        [
          "boolean",
          () => html`<checkbox-element
            @change=${dispatchChange(this, String(key ?? ""))}
            .value=${value}
            .label=${humanizeKey(String(key))}
          ></checkbox-element>`,
        ],
      ])}
    </label>`;
  }

  private firstInvalidComplexType = (
    properties: [key: string, type: (typeof ALL_TYPES)[number]][]
  ): { index: number; errors: any[] } | undefined => {
    for (let i = 0; i < properties.length; ++i) {
      const [key, type] = properties[i];
      if (PRIMITIVE_TYPES.includes(type)) continue;
      const ajv = ajvFactory().compile(
        navigateSchema(this.schema!, key) as JSONSchema7
      );
      const value = this.value?.[key];
      if (ajv(value)) continue;
      return {
        index: i,
        errors: ajv.errors ?? [],
      };
    }
  };

  private renderObject = (
    properties: [key: string, type: (typeof ALL_TYPES)[number]][],
    skipAdditionalProperties = false,
    skipBackButton = false,
    enforceUserFlow = true,
    validate = true
  ): TemplateResult => {
    const firstInvalidComplexType = enforceUserFlow
      ? this.firstInvalidComplexType(properties)
      : void 0;

    const propsUntilComplexType = !firstInvalidComplexType
      ? properties
      : slice(properties, 0, firstInvalidComplexType.index + 1);

    const ajv = ajvFactory().compile(this.schema!);
    ajv(this.value);

    console.log(firstInvalidComplexType?.errors);

    const errors = validate
      ? this.renderErrors(
          firstInvalidComplexType &&
            this.value?.[propsUntilComplexType.at(-1)![0]] && {
              label: firstInvalidComplexType.errors[0].message,
              path: propsUntilComplexType[firstInvalidComplexType.index][0],
            },
          !isEmpty(ajv.errors) && {
            label: ajv!.errors![0].message ?? ""
          }]
        )
      : [];

    return html`
      <div class="flex flex-col gap-8 items-start">
        ${errors}
        ${propsUntilComplexType.map(([key, type]) => {
          const value = this.value?.[key];
          return choose(
            type,
            [
              ["string", () => this.renderPrimitive("string", key)],
              ["number", () => this.renderPrimitive("number", key)],
              ["enum", () => this.renderPrimitive("enum", key)],
              ["boolean", () => this.renderPrimitive("boolean", key, true)],
            ],
            () => this.renderValuePreview(key, value, false)
          );
        })}
        ${when(!skipAdditionalProperties, () =>
          this.renderAdditionalProperties()
        )}
        ${when(!skipBackButton, () => this.renderBackButton("medium", true))}
      </div>
    `;
  };

  private renderAdditionalProperties() {
    const additionalProperties = this.schema?.[ADDITIONAL_PROPERTIES_KEY];
    if (additionalProperties === false) return nothing;
    const propertyKeys = Object.keys(
      (this.schema?.[PROPERTIES_KEY] as unknown as JSONSchema7Value[]) ?? []
    );
    const unspecifiedProperties: [
      key: string,
      type: ReturnType<typeof inferType>
    ][] = Object.entries(this.value ?? {})
      .filter(([key]) => !propertyKeys.includes(key))
      .map(([key, value]) => [key, inferType(undefined, value)]);

    return html`
      ${this.renderObject(unspecifiedProperties, true, true, false, false)}
      <button-element .iconLeft="${icons.ADD()}"
        >Add custom field</button-element
      >
    `;
  }

  private renderValuePreview(
    key: string,
    value: unknown,
    skipHeader = false,
    skipCta = false
  ) {
    const ajv = ajvFactory();
    const schema = navigateSchema(this.schema!, key) as JSONSchema7;
    const compiled = ajv.compile(schema);
    const valid = compiled(value);

    return html`
      <label id="#${key}" class="flex flex-col gap-2 w-full items-start">
        ${when(!skipHeader && key, () =>
          renderLabel(String(key), this.required.includes(String(key)))
        )}
        ${when(
          isUndefined(value) && !skipCta,
          () => html` <button-element
            @click=${() => this.navigate(key)}
            .icon=${icons.ARROW_RIGHT()}
            emphasis="high"
            size="s"
            >Continue with ${humanizeKey(key)}</button-element
          >`,
          () => html`
            <button-element
              class="w-full"
              @click=${() => this.navigate(key)}
              .state=${valid ? "normal" : "error"}
              .iconLeft=${valid ? icons.DONE() : icons.ERROR()}
              .icon=${icons.CHEVRON_RIGHT()}
            >
              <div class="flex flex-col items-start justify-between gap-0 py-2">
                ${humanizeValue(value).map(
                  ([title, preview]) =>
                    html`<div class="flex gap-2">
                      <strong>${title}</strong
                      ><span class="text-slate-500">${preview}</span>
                    </div>`
                )}
              </div>
            </button-element>
          `
        )}
      </label>
    `;
  }

  private renderArray() {
    const itemSchema = this.schema?.items as JSONSchema7;
    if (!itemSchema) return html`<div>no item schema</div>`;
    const enumItems = itemSchema.enum;

    const criteria = this.renderCriteria(
      this.schema?.minItems && [
        `select a minimum of ${this.schema.minItems} item${
          this.schema.minItems > 1 ? "s" : ""
        }`,
        (this.value?.length ?? 0) >= this.schema.minItems,
      ],
      this.schema?.maxItems && [
        `choose no more than ${this.schema.maxItems} item${
          this.schema.maxItems > 1 ? "s" : ""
        }`,
        (this.value?.length ?? 0) <= this.schema.maxItems,
      ],
      // Enum arrays are automatically unique.
      !enumItems &&
        this.schema?.uniqueItems && [
          `items must be unique`,
          (this.value || []).length < 2 ||
            isEqual(this.value, uniq(this.value)),
        ]
    );

    // Enum array.
    if (enumItems) {
      return html`
        ${criteria}
        <checkbox-group-element
          .value=${(this.value ?? []).map((val: string) =>
            enumItems.indexOf(val)
          )}
          @change=${(ev: CustomEvent<ChangeEventDetails<number[]>>) =>
            this.dispatchEvent(
              new CustomEvent<ChangeEventDetails>("change", {
                detail: {
                  value: ev.detail.value.map((i) => enumItems[i]),
                  path: "",
                },
              })
            )}
          .options=${enumItems}
        ></checkbox-group-element>
      `;
    }

    // Regular arrays.
    const itemType = inferType(itemSchema);
    return html`
      ${criteria}
      <ol class="flex flex-col gap-4 list-decimal">
        ${((this.value as any[]) ?? []).map(
          (value, idx) => html`<li class="ml-6 pl-4">
            <div class="flex gap-4 items-baseline">
              ${choose(
                itemType,
                [
                  ["string", () => this.renderPrimitive("string", idx, true)],
                  ["number", () => this.renderPrimitive("number", idx, true)],
                  ["enum", () => this.renderPrimitive("enum", idx, true)],
                ],
                () => this.renderValuePreview(idx.toString(), value, true, true)
              )}
              <button-element
                .iconLeft=${icons.REMOVE()}
                @click="${() =>
                  this.dispatchEvent(
                    new CustomEvent<ChangeEventDetails>("change", {
                      detail: {
                        value: ((this.value as any[]) ?? []).filter(
                          (_, i) => i !== idx
                        ),
                        path: "",
                      },
                    })
                  )}"
              ></button-element>
            </div>
          </li>`
        )}
        <li class="ml-6 pl-4">
          <button-element
            .iconLeft=${icons.ADD()}
            @click="${() => {
              const value = [
                ...(this.value || []),
                // TODO: pick what value you want to add according to itemSchema
                DEFAULT_VALUES[itemType ?? "object"](),
              ];
              this.dispatchEvent(
                new CustomEvent<ChangeEventDetails>("change", {
                  detail: {
                    value,
                    path: "",
                  },
                })
              );

              if (!PRIMITIVE_TYPES.includes(itemType))
                this.navigate(String(value.length - 1));
            }}"
          >
            Add item
          </button-element>
        </li>
      </ol>
    `;
  }

  private renderErrors = (
    ...errors: (
      | Falsy
      | {
          label: string;
          path?: string;
          key?: string;
        }
    )[]
  ) => {
    const applicableErrors = errors.filter(Boolean) as {
      label: string;
      path?: string;
      key?: string;
    }[];
    return when(
      applicableErrors.length,
      () => html`
        <div class="border-red-500 border-l-4 px-4 mb-8 text-slate-800">
          <h3 class="text-2xl font-bold mb-3">Check the form</h3>
          <span>Fix the following:</span>
          <ul class="mt-4">
            ${applicableErrors.map(
              ({ label, path, key }) =>
                html`<li class="ml-0 pl-0 list-none">
                  <a
                    @click=${() => this.navigate(path)}
                    class="font-semibold text-red-600"
                  >
                    ${when(key, () => html`${key} - `)} ${label}
                  </a>
                </li>`
            )}
          </ul>
        </div>
      `
    );
  };

  private renderCriteria = (
    ...criteria: (Falsy | [label: string, valid: boolean])[]
  ) => {
    const applicableCriteria = criteria.filter(Boolean) as [
      label: string,
      valid: boolean
    ][];
    return when(
      applicableCriteria.length,
      () => html`
        <div
          class="${applicableCriteria.some(([, valid]) => !valid)
            ? "border-red-500"
            : "border-slate-500"} border-l-4 px-4 mb-8 text-slate-800"
        >
          <h3 class="text-2xl font-bold mb-3">Criteria</h3>
          <ul>
            ${applicableCriteria.map(
              ([label, valid]) =>
                html`<li
                  class="ml-6 pl-2 ${valid ? "list-check" : "list-cross"}"
                >
                  ${label}
                </li>`
            )}
          </ul>
        </div>
      `
    );
  };
}

export const renderLabel = (
  key: string,
  required?: boolean
): TemplateResult<1> =>
  html`<div class="text-xl font-medium">
    ${humanizeKey(key)}
    ${required ? "*" : html`<span class="text-slate-500">optional</span>`}
  </div>`;
