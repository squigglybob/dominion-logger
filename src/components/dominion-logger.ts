import { html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { OpenElement } from "../open-element"

@customElement("dominion-logger")
export class DominionLogger extends OpenElement {
  @property({ attribute: false })
  kingdoms: Array<any>

  constructor() {
    super()

    this.kingdoms = []
  }

  connectedCallback(): void {
    super.connectedCallback()

    this.loadLogs()
  }

  private loadLogs() {
    const playedKingdomsJSON = localStorage.getItem("kingdomLogs")
    let playedKingdoms: LogData

    if (!playedKingdomsJSON) {
      playedKingdoms = this.initialiseLog()
    } else {
      try {
        playedKingdoms = JSON.parse(playedKingdomsJSON)
      } catch (error: any) {
        console.log(
          "Something went wrong parsing the saved JSON",
          error.message,
        )
        return
      }
    }

    this.kingdoms = playedKingdoms.logs.sort(this.reverseSort)
  }

  private reverseSort(a: Kingdom, b: Kingdom) {
    if (a.timestamp < b.timestamp) {
      return 1
    }
    if (a.timestamp > b.timestamp) {
      return -1
    }
    return 0
  }

  saveLogs() {
    const data = {
      version: 1,
      logs: this.kingdoms,
    }
    localStorage.setItem("kingdomLogs", JSON.stringify(data))
  }

  private logKingdom(event: CustomEvent) {
    const { name, cards } = event.detail
    if (!name || !cards) {
      return
    }

    const playedKingdom = {
      name: name,
      cards: cards,
      timestamp: Date.now(),
      players: [],
    }

    this.kingdoms = [playedKingdom, ...this.kingdoms]

    this.saveLogs()
  }

  private editKingdom(event: CustomEvent) {
    const { name, cards, timestamp } = event.detail
    if (!name || !cards) {
      return
    }

    const kingdom = this.kingdoms.find(
      (kingdom: Kingdom) => kingdom.timestamp === timestamp,
    )
    const kingdomPosition = this.kingdoms.findIndex(
      (kingdom: Kingdom) => kingdom.timestamp === timestamp,
    )

    kingdom.name = name
    kingdom.cards = cards

    /* splice edited kingdom back into place */
    this.kingdoms = [
      ...this.kingdoms.slice(0, kingdomPosition),
      kingdom,
      ...this.kingdoms.slice(kingdomPosition + 1),
    ]
  }
  private deleteKingdom(event: CustomEvent) {
    const { timestamp } = event.detail
    if (!timestamp) {
      return
    }

    const kingdomPosition = this.kingdoms.findIndex(
      (kingdom: Kingdom) => kingdom.timestamp === timestamp,
    )

    this.kingdoms = [
      ...this.kingdoms.slice(0, kingdomPosition),
      ...this.kingdoms.slice(kingdomPosition + 1),
    ]
  }

  initialiseLog(): LogData {
    return {
      version: 1,
      logs: [],
    }
  }

  render() {
    return html`
      <div class="stack">
        <h1>Dominion Logger</h1>
        <log-form @save=${this.logKingdom}></log-form>
        <log-list
          .kingdoms=${this.kingdoms}
          @edit=${this.editKingdom}
          @delete=${this.deleteKingdom}
        ></log-list>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dominion-logger": DominionLogger
  }
}
