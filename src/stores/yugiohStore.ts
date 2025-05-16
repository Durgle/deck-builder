import {yugiohApi} from '@/api/yugiohApi'
import {createCardStore} from './storeFactory.js'
import {GenericCard} from "@/types/card";
import {Validators} from "@/types/validator";
import {DeckRules} from "@/types/deck";
import {CardStore, CardStoreOptions} from "@/types/store";

// Define YuGiOh-specific deck rules
const yugiohDeckRules: DeckRules = {
    maxCopiesPerCard: 3,
    defaultZone: 'main',
    zones: [
        {
            id: 'main',
            name: 'Main Deck',
            maxCards: 60,
            cardFilter: (card: GenericCard) => !card.isExtraDeck
        },
        {
            id: 'extra',
            name: 'Extra Deck',
            maxCards: 15,
            cardFilter: (card: GenericCard) => card.isExtraDeck
        },
    ]
}

// Custom Validator for Yu-gi-oh
const yugiohValidators: Validators = {
    validateCardCopies: (store: CardStore, card: GenericCard) => {

        const cardCount = store.getCardCountInDeck(card.id)

        if (card.originalData && card.originalData.banlist_info) {
            const banlistInfo = card.originalData.banlist_info.ban_tcg ||
                card.originalData.banlist_info.ban_ocg ||
                'unlimited';

            if (banlistInfo === 'banned' && cardCount >= 1) {
                return {valid: false, error: `${card.name} is banned and cannot be used`}
            }

            if (banlistInfo === 'limited' && cardCount >= 1) {
                return {valid: false, error: `${card.name} is limited to 1 copy`}
            }

            if (banlistInfo === 'semi-limited' && cardCount >= 2) {
                return {valid: false, error: `${card.name} is semi-limited to 2 copies`}
            }
        }

        if (yugiohDeckRules.maxCopiesPerCard && cardCount >= yugiohDeckRules.maxCopiesPerCard) {
            return {
                valid: false,
                error: `You cannot have more than ${yugiohDeckRules.maxCopiesPerCard} copies of ${card.name}`
            }
        }

        return {valid: true, error: null}
    },

    validateCompleteDeck: (store: CardStore) => {
        const mainDeckCount = store.deckZones.main.length
        const extraDeckCount = store.deckZones.extra.length

        if (mainDeckCount < 40) {
            return {valid: false, error: 'Main Deck must contain at least 40 cards'}
        }

        if (mainDeckCount > 60) {
            return {valid: false, error: 'Main Deck cannot exceed 60 cards'}
        }

        if (extraDeckCount > 15) {
            return {valid: false, error: 'Extra Deck cannot exceed 15 cards'}
        }

        return {valid: true, error: null}
    }
}

export const useYugiohStore = createCardStore({
    storeName: 'yugioh',
    api: yugiohApi,
    deckRules: yugiohDeckRules,
    customValidators: yugiohValidators
} as CardStoreOptions)