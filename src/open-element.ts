import { LitElement } from "lit"

export class OpenElement extends LitElement {
  protected createRenderRoot(): HTMLElement | DocumentFragment {
    return this
  }
}
