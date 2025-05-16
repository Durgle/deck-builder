import {CardItem} from "@/types/card";
import {DeckZone} from "@/types/deck";

export interface ValidationResult {
    valid: boolean;
    error: string | null;
}

export interface Validators {
    validateDeckBeforeAdd?: (store, card: CardItem) => ValidationResult;
    validateZone?: (store, card: CardItem, targetZone: string, zoneRule: DeckZone) => ValidationResult;
    validateCardCopies?: (store, card: CardItem) => ValidationResult;
    validateCompleteDeck?: (store) => ValidationResult;
}

export interface CardProcessor {
    processCardBeforeAdd?: (store, card: CardItem) => CardItem;
    processAfterCardAdded?: (store, card: CardItem) => void;
    determineCardZone?: (store, card: CardItem) => string;
    beforeCardRemove?: (store, cardId: string | number) => ValidationResult;
    afterCardRemove?: (store, card: CardItem) => ValidationResult;
}