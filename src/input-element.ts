import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("input-element")
export class InputElement extends LitElement {
  static styles = css`
    span {
      color: var(--lorem-ipsum);
    }
  `;

  @property({ type: String })
  readonly label: string = "";

  @property({ type: String })
  value: string = "";

  lorem(ev: MouseEvent) {
    console.log("lorem", ev);
    this.value = ev.pageX.toString();
  }

  render() {
    return html`
      <label>
        ${this.label}
        <input .value=${this.value} type="text" />
        <button @click=${this.lorem}>click me</button>
      </label>
    `;
  }
}
