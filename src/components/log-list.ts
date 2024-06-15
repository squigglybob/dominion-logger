import { html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { OpenElement } from "../open-element"
import { repeat } from "lit/directives/repeat.js"
import { DateTime } from "luxon"

@customElement("log-list")
export class LogList extends OpenElement {
  @property({ type: Array })
  kingdoms: Array<any>

  @property({ type: Number, attribute: false })
  isEditing: Number

  @property({ type: Number, attribute: false })
  isDeleting: Number

  constructor() {
    super()

    this.kingdoms = []
    this.isEditing = 0
    this.isDeleting = 0

    this.renderKingdom = this.renderKingdom.bind(this)
  }

  deleteKingdom(id: Number) {
    this.isDeleting = id
  }
  confirmDelete(id: Number) {
    this.dispatchEvent(new CustomEvent("delete", { detail: { timestamp: id } }))
  }
  cancelDelete() {
    this.isDeleting = 0
  }
  editKingdom(id: Number) {
    this.isEditing = id
  }
  saveKingdom(event: CustomEvent) {
    console.log(event.detail)
    this.dispatchEvent(new CustomEvent("edit", { detail: event.detail }))
    this.isEditing = 0
  }
  cancelEditing() {
    this.isEditing = 0
  }

  private renderKingdom({ name, cards, timestamp }: Kingdom) {
    return html`
      <div class="kingdom" role="listitem">
        ${this.isEditing === timestamp
          ? html`
              <log-form
                editMode
                name=${name}
                cards=${cards}
                timestamp=${timestamp}
                @save=${this.saveKingdom}
                @cancel=${this.cancelEditing}
              ></log-form>
            `
          : html`
              <h2 class="kingdom__name">${name}</h2>
              <p class="kingdom__cards">${cards}</p>
              <p class="kingdom__time">
                ${timestamp && DateTime.fromMillis(timestamp).toHTTP()}
              </p>
              <div class="repel">
                <button
                  class="button small"
                  @click=${() => this.editKingdom(timestamp)}
                >
                  Edit
                </button>
                <div class="cluster">
                  ${this.isDeleting === timestamp
                    ? html`
                        <span>Are you sure?</span>
                        <button
                          class="button small"
                          @click=${() => this.confirmDelete(timestamp)}
                        >
                          Yes
                        </button>
                        <button
                          class="button small"
                          @click=${() => this.cancelDelete()}
                        >
                          No
                        </button>
                      `
                    : html`
                        <button
                          class="button small"
                          @click=${() => this.deleteKingdom(timestamp)}
                        >
                          Delete
                        </button>
                      `}
                </div>
              </div>
            `}
      </div>
    `
  }

  render() {
    console.log(this.kingdoms)
    return html`
      <div class="kingdom-logs" role="list">
        ${repeat(
          this.kingdoms,
          (kingdom) => kingdom.timestamp,
          this.renderKingdom,
        )}
      </div>
    `
  }
}
