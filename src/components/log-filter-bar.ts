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
        this.dispatchEvent(new CustomEvent('search', { detail: { search: this.search} }))
    }

    render() {
        return html`
            <div class="repel">
                <span></span>
                <div>
                    <input
                        type="text"
                        placeholder="Search"
                        @input=${this.onChange}
                    >
                </div>
            </div>
        `;
    }
}
