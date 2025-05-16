export interface GenericCard {
    id: string | number;
    name: string;
    imageUrl: string | null;

    [key: string]: any;
}

export type GameType = 'generic' | 'yugioh' | 'pokemon';