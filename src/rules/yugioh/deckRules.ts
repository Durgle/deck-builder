import {YugiohCard} from "@/types/card";
import {YugiohStatus} from "@/enums/yugiohStatus";
import {DeckList} from "@/types/deckList";
import {isExtra} from "@/utils/yugiohUtils";

export default [
    {
        name: 'same_card',
        filter: (card: YugiohCard, deckList: DeckList) => deckList.deck.filter(item => item.id === card.id).length >= 3
            || deckList.extra.filter(item => item.id === card.id).length >= 3
    },
    {
        name: 'max_deck_card',
        filter: (card: YugiohCard, deckList: DeckList) => !isExtra(card) && deckList.deck.length >= 60
    },
    {
        name: 'max_extra_card',
        filter: (card: YugiohCard, deckList: DeckList) => isExtra(card) && deckList.extra.length >= 15
    },
    {
        name: 'semi_limited_card',
        filter: (card: YugiohCard, deckList: DeckList) => card.status == YugiohStatus.SEMI_LIMITED &&
            (deckList.extra.filter(item => item.id === card.id).length >= 2 ||
                deckList.deck.filter(item => item.id === card.id).length >= 2)
    },
    {
        name: 'limited_card',
        filter: (card: YugiohCard, deckList: DeckList) => card.status == YugiohStatus.LIMITED &&
            (deckList.extra.filter(item => item.id === card.id).length >= 1 ||
                deckList.deck.filter(item => item.id === card.id).length >= 1)
    },
    {
        name: 'forbidden_card',
        filter: (card: YugiohCard, deckList: DeckList) => card.status == YugiohStatus.FORBIDDEN
    },
];