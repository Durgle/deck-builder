import {DeckList} from "@/types/deckList";

export interface DistributionRule<T> {
    name: string;
    filter: DistributionFilter<T>;
}

export interface DeckRule<T> {
    name: string;
    filter: DeckRuleFilter<T>;
}

export type DistributionFilter<T> = (card: T) => boolean;

export type DeckRuleFilter<T> = (card: T, deckList: DeckList) => boolean;

export interface Rules {
    deckRules: function
    distributionRules: function
}