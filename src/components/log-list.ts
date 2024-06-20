import { html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { OpenElement } from "../open-element"
import { repeat } from "lit/directives/repeat.js"
import { DateTime } from "luxon"

@customElement("log-list")
export class LogList extends OpenElement {
  @property({ type: Array })
  kingdoms: Array<any>

  @property({ type: String, attribute: false })
  isEditing: string

  @property({ type: String, attribute: false })
  isDeleting: string

  @property({ type: String, attribute: false })
  openSettingsPanelId: string

  constructor() {
    super()

    this.kingdoms = []
    this.isEditing = ''
    this.isDeleting = ''
    this.openSettingsPanelId = ''

    this.renderKingdom = this.renderKingdom.bind(this)
  }

  deleteKingdom(id: string) {
    this.isDeleting = id
  }
  confirmDelete(id: string) {
    this.dispatchEvent(new CustomEvent("delete", { detail: { id } }))
  }
  cancelDelete() {
    this.isDeleting = ''
  }
  editKingdom(id: string) {
    this.isEditing = id
  }
  saveKingdom(event: CustomEvent) {
    this.dispatchEvent(new CustomEvent("edit", { detail: event.detail }))
    this.isEditing = ''
    this.closeSettings()
  }
  cancelEditing() {
    this.isEditing = ''
  }

  openSettings(id: string) {
    this.openSettingsPanelId = id
  }
  closeSettings() {
    this.openSettingsPanelId = ''
  }

  likeKingdom(id : string) {
    this.dispatchEvent(new CustomEvent("like", { detail: { id, likes: 1 } }))
  }

  unLikeKingdom(id : string) {
    this.dispatchEvent(new CustomEvent("like", { detail: { id, likes: -1 } }))
  }

  bookmarkKingdom(id : string) {
    this.dispatchEvent(new CustomEvent("bookmark", { detail: { id, likes: -1 } }))
  }

  private renderKingdom({ name, cards, note, timestamp, isBookmarked, id, likes }: Kingdom) {
    return html`
      <div class="kingdom" role="listitem">
        ${this.isEditing === id
          ? html`
              <log-form
                editMode
                name=${name}
                cards=${cards}
                note=${note}
                timestamp=${timestamp}
                id=${id}
                @save=${this.saveKingdom}
                @cancel=${this.cancelEditing}
              ></log-form>
            `
          : html`
              <h2 class="kingdom__name">${name}</h2>
              <p class="kingdom__cards">${cards}</p>
              ${
                note ? html`
                  <hr>
                  <p class="kingdom__note">${note}</p>
                ` : ''
              }
              ${
                typeof likes !== 'undefined' ? html`
                  <p class="kingdom__likes">
                    ${likes > -1 ? '+' : ''}${likes} Like${Math.abs(likes) > 1 ? 's' : ''}
                  </p>
                ` : ''
              }
              <p class="kingdom__time">
                ${timestamp && DateTime.fromMillis(timestamp).toHTTP()}
              </p>
              <div class="kingdom__footer">
                ${
                  this.openSettingsPanelId === id ? html`
                    <div class="kingdom__settings repel">
                      <div class="cluster">
                        <button
                          class="button small"
                          @click=${() => this.closeSettings()}
                        >
                          Close
                        </button>

                      </div>
                      <div class="cluster">
                        ${this.isDeleting === id
                          ? html`
                              <span>Are you sure?</span>
                              <button
                                class="button small"
                                @click=${() => this.confirmDelete(id)}
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
                                @click=${() => this.deleteKingdom(id)}
                              >
                                Delete
                              </button>

                            `}
                        <button
                          class="button small"
                          @click=${() => this.editKingdom(id)}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ` : html`
                    <div class="repel">
                      <div class="cluster">
                        <button
                          class="button small"
                          @click=${() => this.likeKingdom(id)}
                        >
                          +1 Like
                        </button>
                        <button
                          class="button small"
                          @click=${() => this.unLikeKingdom(id)}
                        >
                          -1 Like
                        </button>
                        <button
                          class="button small ${isBookmarked ? 'active' : ''}"
                          @click=${() => this.bookmarkKingdom(id)}
                        >
                          Bookmark
                        </button>
                      </div>
                      <button
                        class="button small"
                        @click=${() => this.openSettings(id)}
                      >
                        Settings
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
          (kingdom) => kingdom.id,
          this.renderKingdom,
        )}
      </div>
    `
  }
}
