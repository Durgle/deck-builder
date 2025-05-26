import {defineStore} from 'pinia'
import {GenericCard} from '@/types/card';
import {CardStoreOptions, CardStoreState} from "@/types/store";
import {UnwrapRef} from "vue";

/**
 * Create a typed card store instance for a specific card game
 *
 * @param options Configuration options including API, rules, processors and validators
 */
export function createCardStore<T extends GenericCard = GenericCard>(
    options: CardStoreOptions<T>
) {

    const {
        storeName,
        api,
        deckRules,
        cardAdapter,
        customValidators,
        customCardProcessors
    } = options

    return defineStore(storeName, {
        state: () => ({
            deckZones: deckRules.zones.reduce<Record<string, T[]>>((acc, zone) => {
                acc[zone.id] = []
                return acc
            }, {}),
            currentCard: null,
            searchResults: [],
            loading: false,
            error: null,
            gameType: storeName
        } as CardStoreState<T>),

        getters: {
            /**
             * Get number of cards per zone
             *
             * @returns {Record<string, number>} Object mapping zone ID to card count
             */
            zoneCounts(state): Record<string, number> {
                const counts: Record<string, number> = {}
                Object.keys(state.deckZones).forEach(zone => {
                    counts[zone] = state.deckZones[zone].length
                });
                return counts;
            },

            /**
             * Check if a card is already in the deck.
             */
            isCardInDeck(state): (id: string | number) => boolean {
                return (id) =>
                    Object.values(state.deckZones).some((zone) =>
                        zone.some((card: T) => card.id === id)
                    );
            },

            /**
             * Count number of copies of a card in the deck.
             */
            getCardCountInDeck(state): (id: string | number) => number {
                return (id) =>
                    Object.values(state.deckZones).reduce(
                        (count, zone) => count + zone.filter((card: T) => card.id === id).length,
                        0
                    );
            },

            /**
             * Get the rules associated with this deck.
             */
            getDeckRules() {
                return deckRules;
            },

            /**
             * Total number of cards across all deck zones.
             */
            getTotalCardCount(state): number {
                return Object.values(state.deckZones).reduce(
                    (count, zone) => count + zone.length,
                    0
                );
            },

            /**
             * Get cards in a zone, optionally sorted.
             */
            getSortedDeck: (state) => {
                return (zoneId: string): T[] => {
                    const cards = state.deckZones[zoneId] ?? [];
                    if (customCardProcessors?.sortDeck) {
                        return customCardProcessors.sortDeck(cards);
                    }
                    return [...cards].sort((a, b) => a.name.localeCompare(b.name));
                };
            },
        },

        actions: {
            /**
             * Search cards via API and apply adapter if needed.
             */
            async searchCards(query: string) {
                this.loading = true;
                this.error = null;

                try {
                    const result = await api.searchCards(query);

                    if (result.error) {
                        this.error = {
                            content: result.error,
                            timestamp: Date.now(),
                            type: 'error'
                        };
                        this.searchResults = [];
                    } else {
                        // Map API data to standardized format
                        this.searchResults = result.data.map((card: any) =>
                            cardAdapter ? cardAdapter(card) : api.mapCardData(card)
                        );
                    }
                } catch (error) {
                    this.error = {
                        content: 'Failed to fetch cards. Please try again.',
                        timestamp: Date.now(),
                        type: 'error'
                    };
                    this.searchResults = [];
                } finally {
                    this.loading = false;
                }
            },

            /**
             * Select a card (used for preview or actions).
             */
            selectCard(card: UnwrapRef<T>): void {
                this.currentCard = card;
            },

            /**
             * Validate if a card can be added to the deck.
             */
            canAddCard(card: T): { valid: boolean; error?: string | null; zone?: string } {
                if (customValidators?.validateCardBeforeAdd) {
                    const result = customValidators.validateCardBeforeAdd(this, card);
                    if (!result.valid) return {valid: false, error: result.error};
                }

                const targetZone = this.determineCardZone(card);

                if (!targetZone) {
                    return {
                        valid: false,
                        error: 'Could not determine the appropriate deck zone for this card'
                    };
                }

                const zoneRule = deckRules.zones.find(z => z.id === targetZone);

                if (zoneRule) {
                    if (customValidators?.validateZone) {
                        const result = customValidators.validateZone(this, card, targetZone, zoneRule);
                        if (!result.valid) return {valid: false, error: result.error};
                    } else if (zoneRule.maxCards && this.deckZones[targetZone].length >= zoneRule.maxCards) {
                        return {
                            valid: false,
                            error: `${zoneRule.name} cannot exceed ${zoneRule.maxCards} cards`
                        };
                    }
                }

                if (customValidators?.validateCardCopies) {
                    const result = customValidators.validateCardCopies(this, card);
                    if (!result.valid) return {valid: false, error: result.error};
                }

                return {valid: true, zone: targetZone};
            },

            /**
             * Add a card to the appropriate zone.
             */
            addCardToDeck(card: T): boolean {

                this.error = null;

                // Step 1: Valid the card
                const validation = this.canAddCard(card)
                if (!validation.valid) {
                    this.error = {
                        content: validation.error || 'Validation failed.',
                        timestamp: Date.now(),
                        type: 'error'
                    };
                    return false;
                }

                const targetZone = validation.zone!;

                // Step 2: Check for card count limits
                if (customValidators?.validateCardCopies) {
                    const copyValidation = customValidators.validateCardCopies(this, card);
                    if (!copyValidation.valid) {
                        this.error = {
                            content: copyValidation.error,
                            timestamp: Date.now(),
                            type: 'error'
                        };
                        return false;
                    }
                }

                // Step 3: Clone the card and add a unique key for Vue rendering
                let cardToAdd = {...card}

                // Hook before add
                if (customCardProcessors?.processCardBeforeAdd) {
                    cardToAdd = customCardProcessors.processCardBeforeAdd(this, cardToAdd);
                }

                this.deckZones[targetZone].push(cardToAdd);

                // Hook after add
                if (customCardProcessors?.processAfterCardAdded) {
                    customCardProcessors.processAfterCardAdded(this, cardToAdd);
                }

                return true
            },

            /**
             * Determine which zone the card should go to.
             */
            determineCardZone(card: T): string {

                if (customCardProcessors?.determineCardZone) {
                    return customCardProcessors.determineCardZone(this, card);
                }

                for (const zone of deckRules.zones) {
                    if (zone.cardFilter(card)) {
                        return zone.id;
                    }
                }
                return deckRules.defaultZone;
            },

            /**
             * Remove a card from the deck by ID.
             */
            removeCardFromDeck(id: string | number): boolean {

                if (!this.isCardInDeck(id)) return false;

                // Hook before remove
                if (customCardProcessors?.beforeCardRemove) {
                    customCardProcessors.beforeCardRemove(this, id);
                }

                for (const zoneId in this.deckZones) {
                    const index = this.deckZones[zoneId].findIndex((card: T) => card.id === id);
                    if (index !== -1) {

                        // Remove the card
                        const removedCard = this.deckZones[zoneId][index];
                        this.deckZones[zoneId].splice(index, 1);

                        // Hook after remove
                        if (customCardProcessors?.afterCardRemove) {
                            customCardProcessors.afterCardRemove(this, removedCard);
                        }

                        return true;
                    }
                }
                return false;
            }
        }
    })
}