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

  @property({ type: Number, attribute: false })
  openSettingsPanelId: Number

  constructor() {
    super()

    this.kingdoms = []
    this.isEditing = 0
    this.isDeleting = 0
    this.openSettingsPanelId = 0

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
    this.dispatchEvent(new CustomEvent("edit", { detail: event.detail }))
    this.isEditing = 0
  }
  cancelEditing() {
    this.isEditing = 0
  }

  openSettings(timestamp: number) {
    this.openSettingsPanelId = timestamp
  }
  closeSettings() {
    this.openSettingsPanelId = 0
  }

  likeKingdom(timestamp : number) {
    this.dispatchEvent(new CustomEvent("like", { detail: { timestamp, likes: 1 } }))
  }

  unLikeKingdom(timestamp : number) {
    this.dispatchEvent(new CustomEvent("like", { detail: { timestamp, likes: -1 } }))
  }

  private renderKingdom({ name, cards, timestamp, likes }: Kingdom) {
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
                ${
                  typeof likes !== 'undefined' ? html`
                    <p class="kingdom__likes">
                      ${likes > -1 ? '+' : '-'}${likes} Like${Math.abs(likes) > 1 ? 's' : ''}
                    </p>
                  ` : ''
                }
              <div class="kingdom__footer">
                ${
                  this.openSettingsPanelId === timestamp ? html`
                    <div class="kingdom__settings repel">
                      <div class="cluster">
                        <button
                          class="button small"
                          @click=${() => this.closeSettings()}
                        >
                          Close
                        </button>
                        <button
                          class="button small"
                          @click=${() => this.editKingdom(timestamp)}
                        >
                          Edit
                        </button>
                      </div>
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
                  ` : html`
                    <div class="cluster">
                      <button
                        class="button small"
                        @click=${() => this.openSettings(timestamp)}
                      >
                        Settings
                      </button>
                      <button
                        class="button small"
                        @click=${() => this.likeKingdom(timestamp)}
                      >
                        +1 Like
                      </button>
                      <button
                        class="button small"
                        @click=${() => this.unLikeKingdom(timestamp)}
                      >
                        -1 Like
                      </button>
                    </div>
                  `
                }
              </div>

            `}
      </div>
    `
  }

  render() {
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
