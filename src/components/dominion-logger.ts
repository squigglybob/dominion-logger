import { html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { OpenElement } from "../open-element"
import { v4 as uuid4 } from 'uuid'

@customElement("dominion-logger")
export class DominionLogger extends OpenElement {
  @property({ attribute: false })
  kingdoms: Array<any>

  @property({ attribute: false })
  filteredKingdoms: Array<any>

  @property({ attribute: false })
  searchTerm: string

  @property({ attribute: false })
  sortBy: string

  @property({ attribute: false })
  sortReversed: Boolean

  @property({ type: Number, attribute: false })
  logVersion: Number

  constructor() {
    super()

    this.kingdoms = []
    this.filteredKingdoms = []
    this.searchTerm = ''
    this.sortBy = 'date'
    this.sortReversed = false
    this.logVersion = 1

    this.kingdomSorter = this.kingdomSorter.bind(this)
  }

  connectedCallback(): void {
    super.connectedCallback()

    this.loadLogs()
  }

  private loadLogs() {
    const playedKingdomsJSON = localStorage.getItem("kingdomLogs")
    let logData: LogData

    if (!playedKingdomsJSON) {
      logData = this.initialiseLog()
    } else {
      try {
        logData = JSON.parse(playedKingdomsJSON)
      } catch (error: any) {
        console.log(
          "Something went wrong parsing the saved JSON",
          error.message,
        )
        return
      }
    }

    this.logVersion = logData.version

    /* Migrations */
    this.migrateData(2, logData, (kingdomLog: Kingdom) => {
      return ({
        ...kingdomLog,
        id: uuid4(),
        dateCreated: kingdomLog.timestamp,
        likes: 0,
      })
    })
    this.migrateData(3, logData, (kingdomLog: Kingdom) => {
      return ({
        ...kingdomLog,
        note: '',
      })
    })
    this.migrateData(4, logData, (kingdomLog: Kingdom) => {
      return ({
        ...kingdomLog,
        isBookmarked: false,
        parentId: ''
      })
    })

    this.kingdoms = logData.logs
    this.filteredKingdoms = logData.logs.sort(this.kingdomSorter)
  }
  migrateData(version: number, logData: LogData, callback: (log: Kingdom) => Kingdom) {
    if (logData.version === version - 1) {
      logData.version = version
      this.logVersion = version

      logData.logs = logData.logs.map(callback)

      localStorage.setItem("kingdomLogs", JSON.stringify(logData))
    }
  }

  private kingdomSorter(a: Kingdom, b: Kingdom) {
    let fieldA, fieldB
    switch (this.sortBy) {
      case 'date':
        fieldA = a.timestamp
        fieldB = b.timestamp
        break;
      case 'likes':
        fieldA = a.likes
        fieldB = b.likes
        break;
      case 'bookmarks':
        fieldA = a.isBookmarked
        fieldB = b.isBookmarked
        break;
      default:
        fieldA = a.timestamp
        fieldB = b.timestamp
        break;
    }
    if (fieldA < fieldB) {
      return this.sortReversed ? -1 : 1
    }
    if (fieldA > fieldB) {
      return this.sortReversed ? 1 : -1
    }
    return 0
  }

  saveLogs() {
    const data = {
      version: this.logVersion,
      logs: [ ...this.kingdoms ],
    }
    this.runFilters()
    localStorage.setItem("kingdomLogs", JSON.stringify(data))
  }

  private logKingdom(event: CustomEvent) {
    console.log(event.detail)
    const { name, cards, note } = event.detail
    if (!name || !cards) {
      return
    }

    const playedKingdom : Kingdom = {
      id: uuid4(),
      name: name,
      cards: cards,
      timestamp: Date.now(),
      dateCreated: Date.now(),
      players: [],
      likes: 0,
      isBookmarked: false,
      parentId: '',
      note,
    }

    this.kingdoms = [playedKingdom, ...this.kingdoms]

    this.saveLogs()
  }

  private getKingdom(id: string) : Kingdom {
    const kingdom = this.kingdoms.find(
      (kingdom: Kingdom) => kingdom.id === id,
    )

    return kingdom
  }
  private updateKingdom(kingdom: Kingdom) {
    const { id } = kingdom
    const kingdomPosition = this.kingdoms.findIndex(
      (kingdom: Kingdom) => kingdom.id === id,
    )
    /* splice edited kingdom back into place */
    this.kingdoms = [
      ...this.kingdoms.slice(0, kingdomPosition),
      kingdom,
      ...this.kingdoms.slice(kingdomPosition + 1),
    ]

    this.saveLogs()
  }

  private editKingdom(event: CustomEvent) {
    const { name, cards, note, id } = event.detail
    if (!name || !cards) {
      return
    }

    const kingdom = this.getKingdom(id)

    kingdom.name = name
    kingdom.cards = cards
    kingdom.note = note

    this.updateKingdom(kingdom)
  }
  private deleteKingdom(event: CustomEvent) {
    const { id } = event.detail
    if (!id) {
      return
    }

    const kingdomPosition = this.kingdoms.findIndex(
      (kingdom: Kingdom) => kingdom.id === id,
    )

    this.kingdoms = [
      ...this.kingdoms.slice(0, kingdomPosition),
      ...this.kingdoms.slice(kingdomPosition + 1),
    ]

    this.saveLogs()
  }
  likeKingdom(event: CustomEvent) {
    const { id, likes } = event.detail

    const kingdom = this.getKingdom(id)

    if (typeof kingdom.likes === 'undefined') {
      kingdom.likes = 1
    }
    kingdom.likes = kingdom.likes + likes

    this.updateKingdom(kingdom)
  }
  bookmarkKingdom(event: CustomEvent) {
    const { id } = event.detail

    const kingdom = this.getKingdom(id)

    kingdom.isBookmarked = !kingdom.isBookmarked

    this.updateKingdom(kingdom)
  }

  searchKingdoms(event: CustomEvent) {
    const { search } = event.detail

    this.searchTerm = search
    this.runFilters()

  }
  sortKingdoms(event: CustomEvent) {
    const { sortBy, sortReversed } = event.detail
    console.log(sortBy)
    this.sortBy = sortBy
    this.sortReversed = sortReversed

    this.runFilters()
  }
  runFilters() {
    const search = this.searchTerm.toLowerCase()
    let filteredKingdoms = [ ...this.kingdoms ]

    if (search.length === 0) {
      filteredKingdoms = [ ...this.kingdoms ]
    }
    if (search.length > 0) {
      filteredKingdoms = this.kingdoms.filter((kingdom: Kingdom) => {
        let searchTerms = search.split(',')
        searchTerms = searchTerms.map((search) => search.trim())
        if (this.fieldIncludes(searchTerms, kingdom.name)) {
          return true
        }
        if (this.fieldIncludes(searchTerms, kingdom.cards)) {
          return true
        }
        if (this.fieldIncludes(searchTerms, kingdom.note)) {
          return true
        }
        return false
      })
    }

    console.log(filteredKingdoms)

    this.filteredKingdoms = filteredKingdoms.sort(this.kingdomSorter)
  }
  fieldIncludes(searchTerms: Array<string>, field: string) {
    return searchTerms.every((search) => {
      return field.toLowerCase().includes(search)
    })
  }

  initialiseLog(): LogData {
    return {
      version: 1,
      logs: [],
    }
  }

  render() {
    return html`
      <div class="stack">
        <h1>Dominion Logger</h1>
        <log-form
          @save=${this.logKingdom}
        ></log-form>
        <log-filter-bar
          search=${this.searchTerm}
          sortBy=${this.sortBy}
          ?sortReversed=${this.sortReversed}
          @search=${this.searchKingdoms}
          @sortby=${this.sortKingdoms}
        ></log-filter-bar>
        <log-list
          .kingdoms=${this.filteredKingdoms}
          @edit=${this.editKingdom}
          @delete=${this.deleteKingdom}
          @like=${this.likeKingdom}
          @bookmark=${this.bookmarkKingdom}
        ></log-list>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dominion-logger": DominionLogger
  }
}
