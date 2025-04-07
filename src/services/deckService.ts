import {CardType} from "@/types/card";
import {DeckRule, DistributionRule, Rules} from "@/types/rules";
import {CardGame} from "@/enums/cardGame";
import axios from "axios";
import {rulesMapping} from "@/config/gameRules";

export class DeckService {

    private static instance: DeckService;
    private readonly gameType: CardGame | null = null;
    private gameData: any = null;

    public constructor(gameType: CardGame | null = null) {
        this.gameType = gameType
    }

    static getInstance(gameType: CardGame | null = null): DeckService {
        if (!DeckService.instance) {
            DeckService.instance = new DeckService(gameType);
        }
        return DeckService.instance;
    }

    async loadData() {
        this.gameData = await this.getGameData(this.gameType);
    }

    async fetchJsonData(url: string) {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getGameData(gameType: CardGame | null) {
        const basePath = "/data/";
        let data;
        if (gameType) {
            data = {
                cards: await this.fetchJsonData(`${basePath}${gameType}Cards.json`),
                deckRules: null,
                extraZoneRules: null,
            };

            const rules = rulesMapping[gameType as keyof typeof rulesMapping] as Rules;
            if (rules) {
                data.deckRules = (await rules.deckRules()).default;
                data.extraZoneRules = (await rules.distributionRules()).default;
            }
        } else {
            data = {
                cards: await this.fetchJsonData(`${basePath}cards.json`),
                deckRules: [],
                extraZoneRules: []
            }
        }
        return data;
    }

    getCards(): { [key: number]: CardType } {
        return this.gameData?.cards || {};
    }

    getDeckRules(): DeckRule<CardType>[] {
        return this.gameData?.deckRules || [];
    }

    getExtraZonerRules(): DistributionRule<CardType>[] {
        return this.gameData?.extraZoneRules || [];
    }
}