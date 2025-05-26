import {yugiohApi} from '@/api/yugiohApi'
import {createCardStore} from './storeFactory.js'
import {YugiohAppCard} from "@/types/card";
import {CardProcessor, Validators} from "@/types/validator";
import {DeckRules} from "@/types/deck";

/**
 * Sorting priority for cards in the Main Deck
 */
const mainDeckOrderMap: Record<string, number> = {
    normal: 0,
    normal_pendulum: 1,
    effect: 2,
    effect_pendulum: 3,
    spell: 4,
    trap: 5,
}

/**
 * Sorting priority for cards in the Extra Deck
 */
const extraDeckOrderMap: Record<string, number> = {
    fusion: 0,
    fusion_pendulum: 1,
    synchro: 2,
    synchro_pendulum: 3,
    xyz: 4,
    xyz_pendulum: 5,
    link: 6,
}

/**
 * Yu-Gi-Oh! deck rules
 */
const yugiohDeckRules: DeckRules<YugiohAppCard> = {
    maxCopiesPerCard: 3,
    defaultZone: 'main',
    zones: [
        {
            id: 'main',
            name: 'Main Deck',
            maxCards: 60,
            cardFilter: (card) => !card.isExtraDeck
        },
        {
            id: 'extra',
            name: 'Extra Deck',
            maxCards: 15,
            cardFilter: (card) => card.isExtraDeck
        },
    ]
}

/**
 * Custom validators for Yu-Gi-Oh! deck rules
 */
const yugiohValidators: Validators<YugiohAppCard> = {

    /**
     * Validates whether a specific card can be added
     */
    validateCardCopies: (store, card) => {

        const cardCount = store.getCardCountInDeck(card.id)

        const banlistInfo = card.banlist_info.ban_tcg ||
            card.banlist_info.ban_ocg ||
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

        if (yugiohDeckRules.maxCopiesPerCard && cardCount >= yugiohDeckRules.maxCopiesPerCard) {
            return {
                valid: false,
                error: `You cannot have more than ${yugiohDeckRules.maxCopiesPerCard} copies of ${card.name}`
            }
        }

        return {valid: true, error: null}
    },

    /**
     * Validates the entire deck
     */
    validateCompleteDeck: (store) => {
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

/**
 * Custom card processor for sorting Yu-Gi-Oh! cards in the deck
 */
const yugiohCardProcessor: CardProcessor<YugiohAppCard> = {
    sortDeck: (cards) => {
        return [...cards].sort((a, b) => {
            const isExtraA = a.isExtraDeck ?? false;

            const orderMap = isExtraA ? extraDeckOrderMap : mainDeckOrderMap;

            const typeA = (a.frameType ?? '').toLowerCase();
            const typeB = (b.frameType ?? '').toLowerCase();

            const rankA = orderMap[typeA] ?? 999;
            const rankB = orderMap[typeB] ?? 999;

            if (rankA !== rankB) return rankA - rankB;

            return a.name.localeCompare(b.name);
        })
    },
}

export const useYugiohStore = createCardStore<YugiohAppCard>({
    storeName: 'yugioh',
    api: yugiohApi,
    deckRules: yugiohDeckRules,
    customValidators: yugiohValidators,
    customCardProcessors: yugiohCardProcessor
})