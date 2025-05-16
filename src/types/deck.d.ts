export interface DeckZone {
    id: string;
    name: string;
    maxCards: number | null;
    cardFilter: (card: Card) => boolean;
}

export interface DeckRules {
    maxCopiesPerCard: number | null;
    defaultZone: string;
    zones: DeckZone[];
}