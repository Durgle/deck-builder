export interface Card {
    id: number;
    name: string;
    image: string;
}

export interface YugiohCard extends Card {
    cardType: string;
    property?: string,
    attribute?: string,
    level?: number,
    rank?: number,
    attack?: number,
    defense?: number,
    description: string,
    pendulumEffect?: string,
    linkArrows?: [],
    linkLevel?: number,
    pendulumScale?: number,
    types?: string[],
    password?: string,
    archetypes?: string[],
    status?: string
}