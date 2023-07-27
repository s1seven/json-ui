import { LitElement, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import styles from "./index.css?inline";

import type { JSONSchema7 } from "json-schema";

/**
 * The base element.
 */

export class BaseElement<T> extends LitElement {
  static readonly styles = unsafeCSS(styles);

  @property({ type: Array })
  readonly path: (string | number)[] = [];

  @property({ type: Object })
  readonly baseSchema: JSONSchema7 = {};

  @property({ type: Object })
  readonly schema: JSONSchema7 = {};

  @property({ type: Object })
  value?: any;

  get level() {
    return this.path.length;
  }
}
