import {ApiResponse} from '@/types/api';
import {GenericCard} from '@/types/card';

interface YugiohCard {
    id: number;
    name: string;
    type: string;
    desc: string;
    card_images?: {
        image_url_small: string;
        image_url: string;
    }[];
    banlist_info?: {
        ban_tcg: string,
        ban_ocg: string,
    }

    [key: string]: any;
}

interface YugiohApiResponse {
    data?: YugiohCard[];
    error?: string;
}

export const yugiohApi = {

    async searchCards(query: string): Promise<ApiResponse> {
        try {
            let url = 'https://db.ygoprodeck.com/api/v7/cardinfo.php?num=100&offset=0'
            if (query) {
                url += `&fname=${encodeURIComponent(query)}`
            }

            const response = await fetch(url)
            const data = await response.json() as YugiohApiResponse

            if (data.error) {
                return {error: data.error, data: []}
            } else {
                return {data: data.data || []}
            }
        } catch (error) {
            console.error('Error fetching YuGiOh cards:', error)
            return {error: 'Failed to fetch cards. Please try again.', data: []}
        }
    },

    mapCardData(card: YugiohCard): GenericCard {
        return {
            id: card.id,
            name: card.name,
            type: card.type,
            frameType: card.frameType,
            imageUrl: card.card_images?.[0]?.image_url_small || null,
            description: card.desc,
            isExtraDeck: ['fusion', 'fusion_pendulum', 'synchro', 'synchro_pendulum', 'xyz', 'xyz_pendulum', 'link'].includes(card.frameType),
            originalData: card
        }
    }
}