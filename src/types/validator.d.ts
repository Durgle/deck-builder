import {GenericCard} from "@/types/card";
import {DeckZone} from "@/types/deck";

export interface ValidationResult {
    valid: boolean;
    error: string | null;
}

export interface Validators {
    validateDeckBeforeAdd?: (store, card: GenericCard) => ValidationResult;
    validateZone?: (store, card: GenericCard, targetZone: string, zoneRule: DeckZone) => ValidationResult;
    validateCardCopies?: (store, card: GenericCard) => ValidationResult;
    validateCompleteDeck?: (store) => ValidationResult;
}

export interface CardProcessor {
    processCardBeforeAdd?: (store, card: GenericCard) => GenericCard;
    processAfterCardAdded?: (store, card: GenericCard) => void;
    determineCardZone?: (store, card: GenericCard) => string;
    beforeCardRemove?: (store, cardId: string | number) => ValidationResult;
    afterCardRemove?: (store, card: GenericCard) => ValidationResult;
}