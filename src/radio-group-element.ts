import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./index.css?inline";

/**
 * Radio group element.
 */

@customElement("radio-group-element")
export class RadioGroupElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  @property({ type: Array })
  readonly options: string[] = [];

  @property({ type: String })
  value = this.options[0];

  render() {
    return html` RADIO GROUP `;
  }
}
