import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js'
import { OpenElement } from '../open-element';

@customElement('log-filter-bar')
export class LogFilterBar extends OpenElement {

    @property({ type: String })
    search: string

    @property({ type: String })
    sortBy: string

    @property({ type: Boolean })
    sortReversed: boolean

    sortByOptions: Object

    constructor() {
        super()
        this.search = ''
        this.sortBy = 'date'
        this.sortReversed = false

        this.sortByOptions = {
            'date': 'Date',
            'likes': 'Likes',
            'bookmarks': 'Bookmarks',
        }
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
        const input: HTMLInputElement | null = document.querySelector('.kingdom-search input')
        if (input) {
            input.value = ''
        }
        this.runSearch()
    }
    onSortByChange(sortBy: string) {
        if (this.sortBy === sortBy) {
            this.sortReversed = !this.sortReversed
        } else {
            this.sortReversed = false
        }
        this.sortBy = sortBy
        this.dispatchEvent(new CustomEvent('sortby', {
            detail: {
                sortBy: this.sortBy,
                sortReversed: this.sortReversed
            }
        }))
    }

    render() {
        return html`
            <div class="cluster repel">
                <div class="cluster">
                    <span>Sort by:</span>
                    ${
                        Object.entries(this.sortByOptions).map(([option, label]) => {
                            return html`
                                <button
                                    class="button small ${this.sortBy === option ? 'active' : ''}"
                                    @click=${() => this.onSortByChange(option)}
                                >
                                    ${this.sortBy === option && this.sortReversed ? '-' : ''}${label}
                                </button>
                            `
                        })
                    }

                </div>
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
