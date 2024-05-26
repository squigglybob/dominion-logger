interface LogData {
    version : number,
    logs: Array<Kingdom>,
}

interface Kingdom {
    name : string,
    cards: string,
    timestamp: number,
}