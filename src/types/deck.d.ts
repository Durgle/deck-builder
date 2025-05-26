import {GenericCard} from "@/types/card";

export interface DeckZone<T extends GenericCard = GenericCard> {
    id: string;
    name: string;
    maxCards: number | null;
    cardFilter: (card: T) => boolean;
}

export interface DeckRules<T extends GenericCard = GenericCard> {
    maxCopiesPerCard: number | null;
    defaultZone: string;
    zones: DeckZone<T>[];
}