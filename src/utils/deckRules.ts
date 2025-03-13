import { DeckRule } from '@/types/deckRule';

export const deckRules: DeckRule[] = [
    (cardId: number, selected: number[]) => selected.length >= 40,
    (cardId: number, selected: number[]) => selected.filter(item => item === cardId).length >= 3
];