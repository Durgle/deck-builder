export interface Card {
    id: number;
    name: string;
    image: string;
}

export interface YugiohCard extends Partial<Card> {
    type: string;
    attribute: string|null,
    level: string|null,
    attack: string|null,
    defense: string|null,
    description: string,
    race: string|null,
    cardType: string
}