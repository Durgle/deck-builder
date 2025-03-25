import {Card, YugiohCard} from "@/types/card";
import {CardRule} from "@/types/cardRule";

export const cardRules: CardRule[] = [
    (card: Card | YugiohCard) => {
        const types = ['XYZ', 'Link', 'Fusion', 'Synchro']
        if ("types" in card && Array.isArray(card.types)) {
            return types.some(type => card.types!.includes(type));
        }
        return false
    },
];