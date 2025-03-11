import { Card } from './card';

export type DeckRule = (card: Card, selected: Card[]) => boolean;
