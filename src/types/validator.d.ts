import {GenericCard} from "@/types/card";
import {DeckZone} from "@/types/deck";
import {CardStore} from "@/types/store";

export interface ValidationResult {
    valid: boolean;
    error: string | null;
}

export interface Validators<T extends GenericCard = GenericCard> {
    validateCardBeforeAdd?: (store: CardStore<T>, card: T) => ValidationResult;
    validateZone?: (store: CardStore<T>, card: T, targetZone: string, zoneRule: DeckZone<T>) => ValidationResult;
    validateCardCopies?: (store: CardStore<T>, card: T) => ValidationResult;
    validateCompleteDeck?: (store: CardStore<T>,) => ValidationResult;
}

export interface CardProcessor<T extends GenericCard = GenericCard> {
    processCardBeforeAdd?: (store: CardStore<T>, card: T) => T;
    processAfterCardAdded?: (store: CardStore<T>, card: T) => void;
    determineCardZone?: (store: CardStore<T>, card: T) => string;
    beforeCardRemove?: (store: CardStore<T>, cardId: string | number) => ValidationResult;
    afterCardRemove?: (store: CardStore<T>, card: T) => ValidationResult;
    sortDeck?: (cards: T[]) => T[];
}