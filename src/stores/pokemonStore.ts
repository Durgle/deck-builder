import {pokemonApi} from '@/api/pokemonApi'
import {createCardStore} from './storeFactory.js'
import {PokemonAppCard} from "@/types/card";
import {Validators} from "@/types/validator";
import {DeckRules} from "@/types/deck";

/**
 * Pokémon deck rules
 */
const pokemonDeckRules: DeckRules = {
    maxCopiesPerCard: 4,
    defaultZone: 'main',
    zones: [
        {
            id: 'main',
            name: 'Main Deck',
            maxCards: 60,
            cardFilter: () => true
        }
    ]
}

/**
 * Pokémon deck validators
 * - Enforces 60 card limit
 * - Limits to 4 copies per non-basic Energy card
 */
const pokemonValidators: Validators<PokemonAppCard> = {

    /**
     * Called before adding a card to the deck
     */
    validateCardBeforeAdd: (store) => {

        const currentCount = store.getTotalCardCount
        if (currentCount >= 60) {
            return {valid: false, error: 'A Pokémon deck must contain exactly 60 cards'}
        }
        return {valid: true, error: null}
    },

    /**
     * Validates card copy
     */
    validateCardCopies: (store, card) => {
        const cardCount = store.getCardCountInDeck(card.id)

        if (card.type === 'Energy' &&
            card.subtypes && card.subtypes.includes('Basic')) {
            return {valid: true, error: null}
        }

        if (pokemonDeckRules.maxCopiesPerCard && cardCount >= pokemonDeckRules.maxCopiesPerCard) {
            return {
                valid: false,
                error: `You cannot have more than ${pokemonDeckRules.maxCopiesPerCard} copies of ${card.name}`
            }
        }

        return {valid: true, error: null}
    }
}


export const usePokemonStore = createCardStore<PokemonAppCard>({
    storeName: 'pokemon',
    api: pokemonApi,
    deckRules: pokemonDeckRules,
    customValidators: pokemonValidators,
})