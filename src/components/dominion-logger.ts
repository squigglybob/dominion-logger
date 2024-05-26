import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { OpenElement } from "../open-element";

@customElement("dominion-logger")
export class DominionLogger extends OpenElement {
  @property({ attribute: false })
  name: string;

  @property({ attribute: false })
  cards: string;

  @property({ attribute: false })
  kingdoms: Array<any>;

  constructor() {
    super()

    this.name = ''
    this.cards = ''
    this.kingdoms = []
  }

  connectedCallback(): void {
      super.connectedCallback()

      this.loadLogs()
  }

  private loadLogs() {
    const playedKingdomsJSON = localStorage.getItem('kingdomLogs')
    let playedKingdoms : object

    if (!playedKingdomsJSON) {
      playedKingdoms = this.initialiseLog()
    } else {
      try {
        playedKingdoms = JSON.parse(playedKingdomsJSON)
      } catch (error : any) {
        console.log('Something went wrong parsing the saved JSON', error.message)
        return
      }
    }

    this.kingdoms = playedKingdoms.logs

  }

  saveLogs() {
    const data = {
      version: 1,
      logs: this.kingdoms,
    }
    localStorage.setItem('kingdomLogs', JSON.stringify(data))
  }

  private logKingdom() {
    if (!this.name || !this.cards) {
      return
    }

    console.log(this.name, this.cards)
    const playedKingdom = {
      name: this.name,
      cards: this.cards,
      timestamp: Date.now(),
      players: [],
    }

    this.kingdoms.push(playedKingdom)

    this.saveLogs()
    this.clearForm()
  }

  private clearForm() {
    this.name = ''
    this.cards = ''
  }

  initialiseLog(): object {
    return {
      version: 1,
      logs: [],
    }
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
            .value=${this.name}
          />
          <textarea
            rows="3"
            name="cards"
            placeholder="Kingdom cards used"
            @input=${this.onChange}
            .value=${this.cards}
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
