import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { OpenElement } from "../open-element";

@customElement("dominion-logger")
export class DominionLogger extends OpenElement {
  @property()
  name: string;

  @property()
  cards: string;

  constructor() {
    super()

    this.name = ''
    this.cards = ''
  }

  private logKingdom() {
    console.log(this.name, this.cards)
  }

  onChange(event : any): void {
    switch (event.target.name) {
      case 'name':
        this.name = event.target.value
        break;
      case 'cards':
        this.cards = event.target.value
        break;
      default:
        break;
    }
  }

  render() {
    return html`
      <div class="stack">
        <h1>Dominion Logger</h1>
        <div class="stack logger">
          <input
            type="text"
            name="name"
            placeholder="Name"
            @input=${this.onChange}
            value=${this.name}
          />
          <textarea
            rows="3"
            name="cards"
            placeholder="Kingdom cards used"
            @input=${this.onChange}
            value=${this.cards}
          ></textarea>
          <button class="button" @click=${this.logKingdom}>
            Log Kingdom
          </button>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dominion-logger": DominionLogger;
  }
}
