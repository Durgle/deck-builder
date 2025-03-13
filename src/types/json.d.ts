import {Card, YugiohCard} from "@/types/card";

declare module '@/assets/data/cards.json' {
    const value: { [key: string]: Card };
    export default value;
}

declare module '@/assets/data/yugiohCards.json.json' {
    const value: { [key: string]: YugiohCard };
    export default value;
}