import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { OpenElement } from "../open-element";
import { repeat } from "lit/directives/repeat.js";
import { DateTime } from 'luxon'

@customElement("log-list")
export class LogList extends OpenElement {
  @property({ type: Array })
  kingdoms: Array<any>;

  constructor() {
    super()

    this.kingdoms = []
  }

  private renderKingdom({ name, cards, timestamp } : Kingdom) {
    return html`
        <div class="kingdom" role="listitem">
            <h2 class="kingdom__name">${name}</h2>
            <p class="kingdom__cards">${cards}</p>
            <p class="kingdom__time">${timestamp && DateTime.fromMillis(timestamp).toHTTP()}</p>
        </div>
    `
  }

  render() {
    console.log('listing', this.kingdoms)
    return html`
        <div class="kingdom-logs" role="list">
            ${
                repeat(this.kingdoms, (kingdom) => kingdom.timestamp, this.renderKingdom)
            }
        </div>
    `;
  }
}
