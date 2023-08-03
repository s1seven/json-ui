import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./index.css?inline";

@customElement("view-element")
export class ViewElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  @property({ type: Object })
  baseSchema: any;

  @property({ type: Object })
  item: any;

  render() {
    return html` ${this.item?.type} `;
  }
}
