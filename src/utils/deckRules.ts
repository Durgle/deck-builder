import { DeckRule } from '@/types/deckRule';
import { Card } from '@/types/card';

export const deckRules: DeckRule[] = [
    (card: Card, selected: Card[]) => selected.length >= 40,
    (card: Card, selected: Card[]) => selected.filter(item => item.id === card.id).length >= 3
];