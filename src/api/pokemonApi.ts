import {ApiResponse, CardGameApi} from '@/types/api';
import {PokemonAppCard} from '@/types/card';

interface PokemonCard {
    id: string;
    name: string;
    supertype: string;
    images: {
        small: string;
        large: string;
    };
    rules?: string[];
    subtypes?: string[];
}

interface PokemonApiResponse {
    data?: PokemonCard[];
    error?: string;
}

export const pokemonApi = {

    async fetchCards(query: string): Promise<ApiResponse> {
        try {
            let url = 'https://api.pokemontcg.io/v2/cards'

            if (query) {
                url += `?q=name:"${encodeURIComponent(query)}"`
            }

            const response = await fetch(url)
            const json = await response.json() as PokemonApiResponse

            return {data: json.data || [], error: json?.error};
        } catch (error) {
            return {error: 'Failed to fetch cards. Please try again.', data: []}
        }
    },

    async fetchCardsFromUrl(url: string): Promise<ApiResponse> {
        try {
            const response = await fetch(url);
            const json = await response.json() as PokemonApiResponse;

            return {data: json.data || [], error: json?.error};
        } catch (error) {
            return {error: 'Failed to fetch cards. Please try again.', data: []}
        }
    },

    mapCardData(card: PokemonCard): PokemonAppCard {
        return {
            id: card.id,
            name: card.name,
            type: card.supertype,
            subtypes: card.subtypes || null,
            imageUrl: card.images?.small,
            description: card.rules?.join(' ') || '',
            isEnergy: card.supertype === 'Energy',
            isPokemon: card.supertype === 'Pokémon',
            isTrainer: card.supertype === 'Trainer'
        }
    }
} as CardGameApi<PokemonAppCard>;
