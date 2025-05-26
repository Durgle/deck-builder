import {ApiResponse} from '@/types/api';
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

    async searchCards(query: string): Promise<ApiResponse> {
        try {
            let url = 'https://api.pokemontcg.io/v2/cards'

            if (query) {
                url += `?q=name:"${encodeURIComponent(query)}"`
            }

            const response = await fetch(url)
            const data = await response.json() as PokemonApiResponse

            if (data.error) {
                return {error: data.error, data: []}
            } else {
                return {data: data.data || []}
            }
        } catch (error) {
            console.error('Error fetching Pokemon cards:', error)
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
}
