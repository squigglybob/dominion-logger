import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { OpenElement } from "../open-element";
import { repeat } from "lit/directives/repeat.js";
import { DateTime } from 'luxon'

@customElement("log-list")
export class LogList extends OpenElement {
  @property({ attribute: false })
  kingdoms: Array<any>;

  constructor() {
    super()

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

    console.log(playedKingdoms)
    this.kingdoms = playedKingdoms.logs
  }

  initialiseLog(): object {
    return {
      version: 1,
      logs: [],
    }
  }

  private renderKingdom({ name, cards, timestamp }) {
    return html`
        <div class="kingdom" role="listitem">
            <h2 class="kingdom__name">${name}</h2>
            <p class="kingdom__cards">${cards}</p>
            <p class="kingdom__time">${timestamp && DateTime.fromMillis(timestamp).toHTTP()}</p>
        </div>
    `
  }

  render() {
    return html`
        <div class="kingdom-logs" role="list">
            ${
                repeat(this.kingdoms, (kingdom) => kingdom.timestamp, this.renderKingdom)
            }
        </div>
    `;
  }
}
