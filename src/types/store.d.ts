import {GenericCard} from "@/types/card";
import {DeckRules} from "@/types/deck";
import {CardProcessor, Validators} from "@/types/validator";
import {CardGameApi} from "@/types/api";
import {FlashMessage} from "@/types/flashMessage";
import {createCardStore} from "@/stores/storeFactory";

interface CardStoreState<T extends GenericCard = GenericCard> {
    deckZones: Record<string, T[]>
    searchResults: T[]
    currentCard: T | null,
    loading: boolean
    error: FlashMessage | null
    gameType: string
}

export interface CardStoreOptions<T extends GenericCard = GenericCard> {
    storeName: string;
    api: CardGameApi;
    deckRules: DeckRules<T>;
    cardAdapter?: (card: any) => T;
    customValidators?: Validators<T>;
    customCardProcessors?: CardProcessor<T>;
}

export type CardStore<T extends GenericCard = GenericCard> = ReturnType<ReturnType<typeof createCardStore<T>>>;

