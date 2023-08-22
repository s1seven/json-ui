import { customElement, property } from "lit/decorators.js";

import { LitElement, html, unsafeCSS } from "lit";
import styles from "../index.css?inline";
import { Tree } from "parser/schema-to-tree";

@customElement("tree-element")
export class TreeElement extends LitElement {
  static readonly styles = unsafeCSS(styles);

  @property({ type: Array })
  tree?: Tree;

  protected shouldUpdate(): boolean {
    return Boolean(this.tree);
  }

  render() {
    return html` ${JSON.stringify(this.tree)} `;
  }
}
