import {GenericCard} from '@/types/card';
import {default as cards} from "@/assets/data/cards.json";

interface BaseCard {
    id: number;
    name: string;
    image: string;
}

interface BaseApiResponse {
    data: BaseCard[];
    error?: string;
}

export const baseApi = {

    async searchCards(query: string): Promise<BaseApiResponse> {
        try {

            const response = cards as BaseApiResponse
            let data;
            if (query) {
                data = Object.values(response.data).filter((card) => card.name.toLowerCase().includes(query));
            } else {
                data = response.data
            }

            return {error: response.error, data: data}
        } catch (error) {
            console.error('Error fetching Base cards:', error)
            return {error: 'Failed to fetch cards. Please try again.', data: []}
        }
    },

    mapCardData(card: BaseCard): GenericCard {
        return {
            id: card.id,
            name: card.name,
            imageUrl: card.image
        }
    }
}
