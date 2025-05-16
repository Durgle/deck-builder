export type DragSourceType = 'card-list' | 'deck' | null;

export interface DragPayload {
    card: GenericCard
    gameType: GameType
}

export type DropHandler = (data: DragPayload, event: DragEvent, zoneId?: string) => void