import {pokemonApi} from '@/api/pokemonApi'
import {createCardStore} from './storeFactory.js'
import {GenericCard} from "@/types/card";
import {Validators} from "@/types/validator";
import {CardStore, CardStoreOptions} from "@/types/store";
import {DeckRules} from "@/types/deck";

// Define Pokemon-specific deck rules
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

const pokemonValidators: Validators = {
    validateDeckBeforeAdd: (store: CardStore, card: GenericCard) => {
        // Pokémon TCG exige exactement 60 cartes
        const currentCount = store.getTotalCardCount
        if (currentCount >= 60) {
            return {valid: false, error: 'A Pokémon deck must contain exactly 60 cards'}
        }
        return {valid: true, error: null}
    },

    validateCardCopies: (store: CardStore, card: GenericCard) => {
        const cardCount = store.getCardCountInDeck(card.id)

        if (card.originalData && card.originalData.supertype === 'Energy' &&
            card.originalData.subtypes && card.originalData.subtypes.includes('Basic')) {
            return {valid: true, error: null}
        }

        if (pokemonDeckRules.maxCopiesPerCard && cardCount >= pokemonDeckRules.maxCopiesPerCard) {
            return {
                valid: false,
                error: `You cannot have more than ${pokemonDeckRules.maxCopiesPerCard} copies of ${card.name}`
            }
        }

        return {valid: true, error: null}
    },

    validateCompleteDeck: (store: CardStore) => {
        const totalCards = store.getTotalCardCount

        if (totalCards !== 60) {
            return {valid: false, error: 'A Pokémon deck must contain exactly 60 cards'}
        }

        const hasBasicPokemon = store.deckZones.main.some(card =>
            card.originalData &&
            card.originalData.supertype === 'Pokémon' &&
            card.originalData.subtypes &&
            card.originalData.subtypes.includes('Basic')
        )

        if (!hasBasicPokemon) {
            return {valid: false, error: 'Your deck must contain at least one Basic Pokémon'}
        }

        return {valid: true, error: null}
    }
}


export const usePokemonStore = createCardStore({
    storeName: 'pokemon',
    api: pokemonApi,
    deckRules: pokemonDeckRules,
    customValidators: pokemonValidators,
} as CardStoreOptions)