import {defineStore} from 'pinia'
import {DeckRule, DistributionRule} from "@/types/rules";
import {Card, CardType} from "@/types/card";
import {CardGame} from "@/enums/cardGame";
import {DeckList} from "@/types/deckList";
import {DeckService} from "@/services/deckService";

export const useDeckStore = defineStore('deck', {
    state: () => ({
        searchText: "",
        deckName: "",
        cardList: {} as { [key: number]: CardType },
        selectedCardIds: [] as number[],
        currentCard: null as CardType | null,
        distributionRules: [] as DistributionRule<CardType>[],
        gameType: null as CardGame | null,
        rules: [] as DeckRule<CardType>[],
        extraZoneRules: [] as DistributionRule<CardType>[],
        loading: false,
        error: null as string | null
    }),
    getters: {
        getSelectedCards(state) {
            const deckList = {deck: [], extra: []} as DeckList;

            if (!state.selectedCardIds.length) return deckList;

            const cachedCards = new Map<number, Card>();

            state.selectedCardIds.forEach((cardId) => {
                let card = cachedCards.get(cardId);
                if (!card) {
                    card = state.cardList[cardId];
                    if (!card) return;
                    cachedCards.set(cardId, card);
                }

                const zone = state.extraZoneRules.some(rule => rule.filter(card)) ? "extra" : "deck";
                deckList[zone].push(card);
            });

            const sortByName = (a: Card, b: Card) => a.name.localeCompare(b.name);
            deckList.deck.sort(sortByName);
            deckList.extra.sort(sortByName);

            return deckList;
        },
        getCards(state) {
            return Object.values(state.cardList).filter((card) =>
                card.name.toLowerCase().includes(state.searchText.toLowerCase())
            );
        },
        getFilteredCard(state) {
            return Object.values(state.cardList).filter((card) => card.name.toLowerCase().includes(state.searchText));
        }
    },
    actions: {
        async initializeStore(cardGame: CardGame | null) {
            this.loading = true;
            this.error = null;
            this.gameType = cardGame;

            try {
                const deckService = DeckService.getInstance(this.gameType);
                await deckService.loadData();

                this.cardList = deckService.getCards();
                this.rules = deckService.getDeckRules();
                this.extraZoneRules = deckService.getExtraZonerRules();
            } catch (error) {
                this.error = "An error occurred.";
            } finally {
                this.loading = false;
            }
        },
        addCard(cardId: number) {
            const card = this.cardList[cardId];
            if (!card) return;

            if (!this.rules || !this.rules.some(rule => rule.filter(card, this.getSelectedCards))) {
                this.selectedCardIds.push(cardId);
            }
        },
        removeCard(cardId: number) {
            const index = this.selectedCardIds.indexOf(cardId);
            if (index !== -1) this.selectedCardIds.splice(index, 1);
        },
        selectCard(card: CardType) {
            this.currentCard = card
        }
    }
})