import {Card, YugiohCard} from "@/types/card";

export type CardRule = (card: Card | YugiohCard) => boolean;
