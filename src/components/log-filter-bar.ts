import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js'
import { OpenElement } from '../open-element';

@customElement('log-filter-bar')
export class LogFilterBar extends OpenElement {

    @property({ type: String, attribute: false })
    search: String

    constructor() {
        super()
        this.search = ''
    }

    onChange(event : any) {
        this.search = event.target.value
        this.runSearch()
    }
    runSearch() {
        this.dispatchEvent(new CustomEvent('search', { detail: { search: this.search} }))
    }
    clear() {
        this.search = ''
        this.runSearch()
    }

    render() {
        return html`
            <div class="repel">
                <span></span>
                <div class="kingdom-search">
                    <input
                        type="text"
                        placeholder="Search"
                        @input=${this.onChange}
                    >
                    <button
                        class="button small"
                        class="clear-button"
                        @click=${this.clear}
                    >
                        Clear
                    </button>
                </div>
            </div>
        `;
    }
}
