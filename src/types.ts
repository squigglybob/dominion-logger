interface LogData {
  version: number
  logs: Array<Kingdom>
}

interface Kingdom {
  id: string
  name: string
  cards: string
  timestamp: number
  dateCreated: number
  note: string
  likes: number
  isBookmarked: boolean
  parentId: string
  players: Array<Play>
}

interface Play {
  playerId: string
  score: number
  cards: Array<Card>
  gameLog: Object
}

interface Player {
  id: string
  name: string
}

interface Card {
  name: string
  token: string
}