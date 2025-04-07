import {YugiohCard} from "@/types/card";
import {isExtra} from "@/utils/yugiohUtils";

export default [
    {
        name: 'extra_deck',
        filter: (card: YugiohCard) => isExtra(card)
    }
];