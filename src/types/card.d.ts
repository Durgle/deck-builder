export interface Card {
    id: number;
    name: string;
    image: string;
}

export interface YugiohCard extends Card {
    cardType: string;
    property: string | null,
    attribute: string | null,
    level: number | null,
    rank: number | null,
    attack: number | null,
    defense: number | null,
    description: string,
    pendulumEffect: string | null,
    linkArrows: [] | null,
    linkLevel: number | null,
    pendulumScale: number | null,
    types: string[] | null,
    password: string | null,
    archetypes: string[] | null,
    status: string | null
}

export type CardType = Card | YugiohCard;