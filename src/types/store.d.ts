import {GenericCard} from "@/types/card";
import {Store} from "pinia";
import {DeckRules} from "@/types/deck";
import {CardProcessor, Validators} from "@/types/validator";
import {CardGameApi} from "@/types/api";
import {FlashMessage} from "@/types/flashMessage";

interface CardStoreState {
    deckZones: Record<string, GenericCard[]>
    searchResults: GenericCard[]
    currentCard: GenericCard | null,
    loading: boolean
    error: FlashMessage | null
    gameType: string
}

export interface CardStoreOptions {
    storeName: string;
    api: CardGameApi;
    deckRules: DeckRules;
    currentCard: GenericCard | null;
    cardAdapter?: (card: any) => GenericCard;
    customValidators?: Validators;
    customCardProcessors?: CardProcessor;
}

export type CardStore = Store<
    string,
    CardStoreState,
    {
        zoneCounts(state: CardStore): Record<string, number>
        isCardInDeck(state: CardStore): (id: string | number) => boolean
        getCardCountInDeck(state: CardStore): (id: string | number) => number
        getDeckRules(): DeckRules
        getTotalCardCount(): number
    },
    {
        searchCards: (query: string) => Promise<void>
        selectCard: (card: GenericCard) => void
        canAddCard(card: GenericCard): { valid: boolean; error?: string | null; zone?: string }
        addCardToDeck: (card: GenericCard) => boolean
        determineCardZone: (card: GenericCard) => string
        removeCardFromDeck: (id: string | number) => boolean
    }
>