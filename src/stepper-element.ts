import { customElement, property } from "lit/decorators.js";
import { html } from "lit";

import { BaseElement } from "./base-element";
import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { humanizeKey } from "./humanize";
import { resolveLocalReferences } from "./resolve-local-references";

/**
 * Stepper element.
 */

@customElement("stepper-element")
export class StepperElement extends BaseElement<any> {
  paths?: string[][];

  @property({ type: Number })
  index = 0;

  render() {
    if (!this.paths) this.paths = schemaToPaths(this.baseSchema, this.schema);
    if (!this.paths) return html``;
    console.log(this.paths, "lorem");
    const path = this.paths[this.index];
    if (!path) return html``;
    const schema = getSchemaFromPath(this.schema, path);
    const key = path.at(-1);
    return html`
      <div class="grid grid-cols-2">
        <div>
          ${this.paths.map((path, i, arr) => {
            const key = path.at(-1) as string;
            // const prevItem = arr[i - 1]?.at(-1) as string;

            // const title

            return html`
              <button
                class="text-sm px-2 block bg-slate-50 rounded-md text-slate-700"
                style="margin-left: ${path.length - 1}rem;"
                @click=${() => (this.index = i)}
                type="button"
              >
                ${humanizeKey(key)}
              </button>
            `;
          })}
        </div>
        <any-element
          .path=${path}
          .baseSchema=${this.baseSchema}
          .schema=${schema}
          .key=${key}
        ></any-element>

        <div class="flex justify-end col-start-2">
          <button
            @click=${() => (this.index = this.index + 1)}
            type="button"
            class="m-1 ml-0 py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm"
          >
            Next
            <svg
              class="w-2.5 h-auto"
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M1 7C0.447715 7 -3.73832e-07 7.44771 -3.49691e-07 8C-3.2555e-07 8.55228 0.447715 9 1 9L13.0858 9L7.79289 14.2929C7.40237 14.6834 7.40237 15.3166 7.79289 15.7071C8.18342 16.0976 8.81658 16.0976 9.20711 15.7071L16.0303 8.88388C16.5185 8.39573 16.5185 7.60427 16.0303 7.11612L9.20711 0.292893C8.81658 -0.0976318 8.18342 -0.0976318 7.79289 0.292893C7.40237 0.683417 7.40237 1.31658 7.79289 1.70711L13.0858 7L1 7Z"
                fill="currentColor"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    `;
  }
}

function schemaToPaths(
  baseSchema: JSONSchema7Definition,
  schema: JSONSchema7Definition,
  path: string[] = []
): string[][] {
  if (typeof schema === "boolean") return [];
  let result: string[][] = [];

  if (schema.type === "object" && schema.properties) {
    for (let key in schema.properties) {
      let newPath = [...path, key];
      let subPaths = schemaToPaths(
        baseSchema,
        resolveLocalReferences(
          baseSchema as JSONSchema7,
          schema.properties[key] as JSONSchema7,
          2
        ),
        newPath
      );
      result = [...result, ...subPaths];
    }
  } else if (
    schema.type === "array" &&
    schema.items &&
    typeof schema.items === "object"
  ) {
    // We're considering the array as one dimension
    // and we don't know its actual size, so let's denote its index as '*'
    let newPath = [...path, "*"];
    let subPaths = schemaToPaths(
      baseSchema,
      resolveLocalReferences(
        baseSchema as JSONSchema7,
        schema.items as JSONSchema7,
        2
      ),
      newPath
    );
    result = [...result, ...subPaths];
  } else {
    // Leaf node
    result.push(path);
  }

  return result;
}

function getSchemaFromPath(
  schema: JSONSchema7,
  path: string[]
): JSONSchema7Definition | undefined {
  let currentSchema: JSONSchema7Definition = schema;

  for (const segment of path) {
    if (typeof currentSchema === "boolean") {
      return undefined;
    }

    if (segment === "*") {
      if (currentSchema.type === "array" && currentSchema.items) {
        // Assume tuple-typed or use first item as representative schema for all items
        currentSchema = Array.isArray(currentSchema.items)
          ? currentSchema.items[0]
          : currentSchema.items;
      } else {
        return undefined;
      }
    } else {
      if (
        currentSchema.type === "object" &&
        currentSchema.properties &&
        currentSchema.properties[segment]
      ) {
        currentSchema = currentSchema.properties[segment];
      } else {
        return undefined;
      }
    }
  }

  return currentSchema;
}
