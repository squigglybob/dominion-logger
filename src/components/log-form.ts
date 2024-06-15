import { html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { OpenElement } from "../open-element"

@customElement("log-form")
export class LogForm extends OpenElement {
  @property({ type: Boolean })
  editMode: Boolean

  @property({ type: String })
  name: string

  @property({ type: String })
  cards: string

  @property({ type: Number })
  timestamp: Number

  constructor() {
    super()

    this.name = ""
    this.cards = ""
    this.timestamp = 0
    this.editMode = false
  }

  private clearForm() {
    this.name = ""
    this.cards = ""
  }

  onChange(event: any): void {
    switch (event.target.name) {
      case "name":
        this.name = event.target.value
        break
      case "cards":
        this.cards = event.target.value
        break
      default:
        break
    }
  }

  logKingdom() {
    this.dispatchEvent(
      new CustomEvent("save", {
        detail: {
          name: this.name,
          cards: this.cards,
          timestamp: this.timestamp,
        },
      }),
    )
    this.clearForm()
  }
  cancel() {
    this.dispatchEvent(new CustomEvent("cancel"))
    this.clearForm()
  }

  render() {
    return html`
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
        <div class="cluster">
          <button class="button" @click=${this.logKingdom}>
            ${this.editMode ? "Save" : "+1 Log"}
          </button>
          ${this.editMode
            ? html`
                <button class="button secondary" @click=${this.cancel}>
                  Cancel
                </button>
              `
            : ""}
        </div>
      </div>
    `
  }
}
