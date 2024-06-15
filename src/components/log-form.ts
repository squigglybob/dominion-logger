import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js'
import { OpenElement } from '../open-element';

@customElement('log-form')
export class LogForm extends OpenElement {
  @property({ attribute: false })
  name: string;

  @property({ attribute: false })
  cards: string;

    constructor() {
        console.log('construct form')
        super()

        this.name = ''
        this.cards = ''
    }

    private clearForm() {
        this.name = ''
        this.cards = ''
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

  logKingdom() {
    this.dispatchEvent(new CustomEvent( 'log-kingdom', { detail: { name: this.name, cards: this.cards } } ))
    this.clearForm()
  }

    render() {
        console.log('render form')
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
              <button class="button" @click=${this.logKingdom}>
                Log Kingdom
              </button>
            </div>
        `;
    }
}
