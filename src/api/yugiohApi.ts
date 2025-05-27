import {ApiResponse, CardGameApi} from '@/types/api';
import {YugiohAppCard} from '@/types/card';

interface YugiohCard {
    id: number;
    name: string;
    type: string;
    frameType: string;
    desc: string;
    monster_desc?: string;
    pend_desc?: string;
    linkmarkers?: string[];
    linkval?: number;
    humanReadableCardType: string;
    atk?: number;
    def?: number;
    level?: number;
    scale?: number;
    race?: string;
    typeline?: string[];
    attribute?: string;
    card_sets?: {
        set_name: string;
        set_code: string;
        set_rarity: string;
        set_rarity_code: string;
        set_price: string;
    }[],
    card_images?: {
        image_url_small: string;
        image_url: string;
    }[];
    banlist_info?: {
        ban_tcg: string,
        ban_ocg: string,
    }
}

interface YugiohMeta {
    current_rows: number;
    total_rows: number;
    rows_remaining: number;
    total_pages: number;
    pages_remaining: number;
    next_page: string;
    next_page_offset: number;
}

interface YugiohApiResponse {
    data?: YugiohCard[];
    error?: string;
    meta?: YugiohMeta;
}

export const yugiohApi = {

    async fetchCards(query: string): Promise<ApiResponse> {
        try {
            let url = 'https://db.ygoprodeck.com/api/v7/cardinfo.php?num=200&offset=0'
            if (query) {
                // noinspection SpellCheckingInspection
                url += `&fname=${encodeURIComponent(query)}`
            }

            const response = await fetch(url)
            const json = await response.json() as YugiohApiResponse

            return {data: json.data || [], error: json?.error, meta: json?.meta};
        } catch (error) {
            return {error: 'Failed to fetch cards. Please try again.', data: []}
        }
    },

    async fetchCardsFromUrl(url: string): Promise<ApiResponse> {
        try {
            const response = await fetch(url);
            const json = await response.json() as YugiohApiResponse;

            return {data: json.data || [], error: json?.error, meta: json?.meta};
        } catch (error) {
            return {error: 'Failed to fetch cards. Please try again.', data: []}
        }
    },

    mapCardData(card: YugiohCard): YugiohAppCard {
        const isXyz = ['xyz', 'xyz_pendulum'].includes(card.frameType);
        return {
            id: card.id,
            name: card.name,
            has_stats: !['trap', 'spell'].includes(card.frameType),
            type: card.type,
            frameType: card.frameType,
            readableType: card.humanReadableCardType,
            attribute: card.attribute ?? null,
            level: (!isXyz && card.level) ? card.level : null,
            rank_level: (isXyz && card.level) ? card.level : null,
            att: card.atk ?? null,
            def: card.def ?? null,
            race: card.race ?? null,
            tagList: card.typeline ?? null,
            imageUrl: card.card_images?.[0]?.image_url_small ?? null,
            description: (card.scale && card.monster_desc) ? card.monster_desc : (card.desc ?? null),
            pendulum_description: card.pend_desc ?? null,
            pendulum_scale: card.scale ?? null,
            link_markers: card.linkmarkers ?? null,
            link_level: card.linkval ?? null,
            isExtraDeck: ['fusion', 'fusion_pendulum', 'synchro', 'synchro_pendulum', 'xyz', 'xyz_pendulum', 'link'].includes(card.frameType),
            banlist_info: {
                ban_tcg: card.banlist_info?.ban_tcg ?? null,
                ban_ocg: card.banlist_info?.ban_ocg ?? null,
            }
        }
    }
} as CardGameApi<YugiohAppCard>