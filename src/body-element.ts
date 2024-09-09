import {
  LitElement,
  PropertyValueMap,
  TemplateResult,
  css,
  html,
  unsafeCSS,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./index.css?inline";
import { JSONSchema7 } from "json-schema";
import {
  DEFAULT_VALUES,
  PROPERTIES_KEY,
  PRIMITIVE_TYPES,
  ALL_TYPES,
  PATH_UP,
  ROOT_PATH,
} from "./constants";
import { inferType } from "./parser/infer";
import { JSONSchema7Value } from "./utils/helper-types";
import { ChangeEventDetails, dispatchChange } from "./utils/dispatch-change";
import { humanizeKey, humanizeValue } from "./utils/humanize";
import { choose } from "lit/directives/choose.js";
import { when } from "lit/directives/when.js";
import { isEmpty, isEqual, isUndefined, slice, uniq } from "lodash";
import { PathSegment, navigateSchema } from "./utils/path";
import { icons } from "./ui/icons";
import { Falsy } from "./utils/falsy";
import { ajvFactory } from "./parser/ajv";

@customElement("body-element")
export class BodyElement extends LitElement {
  static readonly styles = [
    unsafeCSS(styles),
    css`
      :host label.error {
        outline: 4px solid red;
        outline-offset: 1rem;
      }
    `,
  ];

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

  protected shouldUpdate(): boolean {
    return !!this.schema;
  }

  render() {
    console.debug(`[DEBUG] Rendering body.`);
    const itemType = inferType(this.schema!, this.value);

    return html`
      ${choose(
        itemType,
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
                ]),
                false,
                this.path === ROOT_PATH
              ),
          ],
          ["array", () => this.renderArray()],
          [undefined, () => html``],
        ],
        () => this.renderProperty()
      )}
      <div class="h-8"></div>
      ${when(
        itemType !== "object" && !!this.path,
        () => html`<button-element
          @click=${() => this.navigate(PATH_UP)}
          emphasis="high"
          size="s"
        >
          Continue</button-element
        >`
      )}
    `;
  }

  private navigate(...segments: PathSegment[]) {
    this.dispatchEvent(
      new CustomEvent<PathSegment[]>("navigate", {
        detail: segments,
      })
    );
  }

  private renderProperty(
    key?: string | number,
    skipRemove = false,
    skipLabel = false
  ) {
    const value = !isUndefined(key) ? this.value?.[key] : this.value;
    const schema =
      typeof key === "number"
        ? (this.schema!.items as JSONSchema7)
        : (navigateSchema(this.schema!, key) as JSONSchema7);

    const itemType = inferType(schema, value);
    const title = key ?? schema?.title;
    const description = schema?.description;
    const ajv = ajvFactory();
    const compiled = ajv.compile(schema);
    const valid = compiled(value);
    const required = this.required.includes(String(key));

    return html`
      <label
        id="#${key}"
        class="flex min-w-0 flex-col gap-4 w-full ${when(
          !isUndefined(value) && !valid,
          () => "error"
        )}"
      >
        ${when(title && !skipLabel, () =>
          renderLabel(String(title), description, required)
        )}
        ${when(
          PRIMITIVE_TYPES.includes(itemType),
          () => this.renderPrimitive(itemType, value, schema, key),
          () =>
            this.renderValuePreview(
              itemType,
              value,
              schema,
              key,
              required,
              valid,
              skipRemove
            )
        )}
      </label>
    `;
  }

  private renderPrimitive(
    type: (typeof PRIMITIVE_TYPES)[number],
    value: any,
    schema: any,
    key?: string | number
  ) {
    return when(
      schema?.enum,
      () => html`<single-dropdown-element
        @change=${dispatchChange(this, String(key ?? ""))}
        .options=${((schema?.enum as any[]) ?? []).map((item) => String(item))}
        .value=${value}
      ></single-dropdown-element>`,
      () =>
        choose(type, [
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
            "integer",
            () => html`<number-element
              @change=${dispatchChange(this, String(key ?? ""))}
              .value=${value}
              .schema=${schema}
            ></number-element>`,
          ],
          [
            "boolean",
            () => html`<checkbox-element
              @change=${dispatchChange(this, String(key ?? ""))}
              .value=${value}
              .label=${humanizeKey(String(key))}
            ></checkbox-element>`,
          ],
        ])
    );
  }

  private firstInvalidComplexType = (
    properties: [key: string, type: (typeof ALL_TYPES)[number]][],
    required?: string[]
  ): { index: number; errors: any[] } | undefined => {
    for (let i = 0; i < properties.length; ++i) {
      const [key, type] = properties[i];
      if (required && !required.includes(key)) continue;
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
      ? this.firstInvalidComplexType(properties, this.required)
      : void 0;

    const propsUntilComplexType = !firstInvalidComplexType
      ? properties
      : slice(properties, 0, firstInvalidComplexType.index + 1);

    const ajv = ajvFactory().compile(this.schema!);
    ajv(this.value);

    const errors = validate
      ? this.renderErrors(
          firstInvalidComplexType &&
            this.value?.[propsUntilComplexType.at(-1)![0]] && {
              label: firstInvalidComplexType.errors[0].message,
              path: propsUntilComplexType[firstInvalidComplexType.index][0],
            },
          !isEmpty(ajv.errors) && {
            label: ajv!.errors![0].message ?? "",
          }
        )
      : [];

    // ${when(!skipAdditionalProperties, () =>
    //   this.renderAdditionalProperties()
    // )}

    return html`
      <div class="flex flex-col gap-16 items-start">
        ${errors}
        ${propsUntilComplexType.map(([key]) => this.renderProperty(key))}
        ${when(
          !skipBackButton && !firstInvalidComplexType,
          () =>
            html`<button-element
              @click=${() => this.navigate(PATH_UP)}
              emphasis="high"
              size="s"
            >
              Continue</button-element
            >`
        )}
      </div>
    `;
  };

  private renderValuePreview(
    type: (typeof PRIMITIVE_TYPES)[number],
    value: any,
    schema: any,
    key?: string | number,
    required?: boolean,
    valid?: boolean,
    skipRemove = false
  ) {
    return html`
      ${when(
        isUndefined(value) && required,
        () => html` <button-element
          @click=${() => this.navigate(key as any)}
          emphasis="high"
          size="s"
        >
          Continue</button-element
        >`,
        () => html`
          <div class="flex gap-2">
            <button-element
              class="w-full min-w-0"
              @click=${() => this.navigate(key as any)}
              .icon=${icons.CHEVRON_RIGHT()}
            >
              ${humanizeValue(value).map(
                ([title]) =>
                  html`<div class="flex gap-2 min-w-0">
                    <span class="truncate text-slate-800 text-left font-medium"
                      >${title}</span
                    >
                  </div>`
              )}
            </button-element>

            ${when(
              !isUndefined(value) && !skipRemove,
              () => html`<button-element
                .icon=${icons.REMOVE()}
                @click="${() =>
                  this.dispatchEvent(
                    new CustomEvent<ChangeEventDetails>("change", {
                      detail: {
                        value: void 0,
                        path: key as any,
                      },
                    })
                  )}"
              ></button-element>`
            )}
          </div>
        `
      )}
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
          (_, idx) => html`<li class="ml-6 pl-4">
            <div class="flex gap-4">
              ${this.renderProperty(idx, true, true)}
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
      applicableErrors.length && false,
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
  description?: string,
  required?: boolean
): TemplateResult<1> =>
  html`<div>
    <h2 class="text-2xl font-medium">
      ${humanizeKey(key)}
      ${required ? "*" : html`<span class="text-slate-500">optional</span>`}
    </h2>
    ${when(
      description,
      () => html`<p class="text-slate-800">${description}</p>`
    )}
  </div>`;
