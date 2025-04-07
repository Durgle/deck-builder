import {Card, YugiohCard} from "@/types/card";

export const isExtra = (card: Card | YugiohCard) => {
    const types = ['xyz', 'link', 'fusion', 'synchro']
    if ("types" in card && Array.isArray(card.types)) {
        return card.types.some(type => types.includes(type.toLowerCase()));
    }
    return false
};