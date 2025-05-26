export interface GenericCard {
    id: string | number;
    name: string;
    imageUrl: string | null;
}

export interface YugiohAppCard extends GenericCard {
    type: string,
    has_stats: boolean,
    frameType: string,
    attribute: string | null,
    readableType: string,
    level: number | null,
    rank_level: number | null,
    att: number | null,
    def: number | null,
    race: string | null,
    tagList: string[] | null,
    description: string | null,
    pendulum_description: string | null,
    pendulum_scale: number | null,
    link_markers: string[] | null;
    link_level: number | null;
    isExtraDeck: boolean,
    banlist_info: {
        ban_tcg: string | null,
        ban_ocg: string | null,
    }
}

export interface PokemonAppCard extends GenericCard {
    type: string;
    subtypes: string[] | null;
    description: string;
    isEnergy: boolean,
    isPokemon: boolean,
    isTrainer: boolean
}

export type GameType = 'generic' | 'yugioh' | 'pokemon';