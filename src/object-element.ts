import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { JSONSchema7 } from "json-schema";
import { BaseElement } from "./base-element";

/**
 * An object.
 */

@customElement("object-element")
export class ObjectElement extends BaseElement<Object> {
  title = "";

  @property({ type: String })
  description = "";

  @property({ type: Array })
  fields: [key: string, schema: JSONSchema7][] = [];

  firstUpdated() {
    this.fields = Object.entries(this.schema.properties ?? {}) as [
      key: string,
      schema: JSONSchema7
    ][];

    if (this.schema.title) {
      this.title = this.schema.title;
    }

    if (this.schema.description) {
      this.description = this.schema.description;
    }
  }

  // This is a silent update so that the component does not re-render.
  valueChanged(key: string, value: any) {
    if (!this.value) this.value = {};
    this.value[key] = value;
  }

  render() {
    return html`
      <div class="flex flex-col gap-4">
        ${this.fields.map(
          ([key, field]) => html`<any-element
            @value-changed=${(ev: CustomEvent<any>) =>
              this.valueChanged(key, ev.detail)}
            .path=${[...this.path, key]}
            .key=${key}
            .baseSchema="${this.baseSchema}"
            .schema="${field}"
          ></any-element>`
        )}
      </div>
    `;
  }
}
