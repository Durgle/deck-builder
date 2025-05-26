export interface DragPayload {
    card: GenericCard
    gameType: GameType
}

export type DropHandler = (data: DragPayload, event: DragEvent, zoneId?: string) => void

export type DragZoneType = 'card-list' | 'deck' | null