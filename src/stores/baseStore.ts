import {baseApi} from '@/api/baseApi'
import {createCardStore} from './storeFactory.js'
import {CardStoreOptions} from "@/types/store";
import {DeckRules} from "@/types/deck";
import {GenericCard} from "@/types/card";

/**
 * Deck rules
 */
const baseDeckRules: DeckRules = {
    maxCopiesPerCard: null,
    defaultZone: 'main',
    zones: [
        {
            id: 'main',
            name: 'Main Deck',
            maxCards: null,
            cardFilter: () => true
        }
    ]
}
export const useBaseStore = createCardStore<GenericCard>({
    storeName: 'base',
    api: baseApi,
    deckRules: baseDeckRules,
} as CardStoreOptions)