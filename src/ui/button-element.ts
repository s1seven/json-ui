import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "../index.css?inline";
import { Icon } from "./icons";
import { when } from "lit/directives/when.js";

export type ButtonEmphasis = "high" | "medium";

/**
 * Button element.
 */

@customElement("button-element")
export class ButtonElement extends LitElement {
  static readonly styles = [
    unsafeCSS(styles),
    css`
      :host {
        display: inline-block;
      }
    `,
  ];

  @property({ type: Boolean })
  readonly project = true;

  @property({ type: Object })
  readonly icon?: Icon;

  @property({ type: String })
  readonly state: "normal" | "error" = "normal";

  @property({ type: Object })
  readonly iconLeft?: Icon;

  @property({ type: String })
  readonly label: string = "";

  @property({ type: String })
  readonly emphasis: ButtonEmphasis = "medium";

  @property({ type: String })
  readonly size: "xs" | "s" | "m" = "s";

  render() {
    return html`<button
      class="${[
        "cursor-pointer select-none w-full inline-flex items-center gap-2 rounded-sm box-border align-middle focus:ring-2 focus:ring-offset-1 focus:outline-none active:translate-y-[1px] active:ring-0",
        {
          xs: "min-h-[32px] px-2 text-sm",
          s: "min-h-[40px] px-3 text-base",
          m: "min-h-[48px] px-4 text-lg",
        }[this.size],
        {
          medium:
            "bg-transparent text-slate-900 font-semibold border border-slate-600 hover:bg-stone-100 focus:ring-stone-500",
          high: "bg-green-600 text-white font-semibold shadow-sm hover:bg-green-700 focus:ring-green-600",
        }[this.emphasis],
        {
          normal: "",
          error: "border-red-600 text-red-600",
        }[this.state],
      ].join(" ")}"
    >
      ${this.iconLeft}
      <slot></slot>
      ${this.icon}
    </button>`;
  }
}
