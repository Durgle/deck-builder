import {defineStore} from 'pinia'
import {GenericCard} from '@/types/card';
import {DeckRules, DeckZone} from '@/types/deck';
import {CardStoreOptions, CardStoreState} from "@/types/store";

export function createCardStore(options: CardStoreOptions) {

    const {
        storeName,
        api,
        deckRules,
        cardAdapter,
        customValidators,
        customCardProcessors
    } = options

    return defineStore(storeName, {
        state: (): CardStoreState => ({
            deckZones: deckRules.zones.reduce((acc: Record<string, GenericCard[]>, zone: DeckZone) => {
                acc[zone.id] = []
                return acc
            }, {}),
            currentCard: null,
            searchResults: [],
            loading: false,
            error: null,
            gameType: storeName
        }),

        getters: {
            zoneCounts(state): Record<string, number> {
                const counts: Record<string, number> = {}
                Object.keys(state.deckZones).forEach(zone => {
                    counts[zone] = state.deckZones[zone].length
                })
                return counts
            },

            isCardInDeck(state): (id: string | number) => boolean {
                return (id) => Object.values(state.deckZones).some(zone =>
                    zone.some(card => card.id === id)
                )
            },

            getCardCountInDeck(state): (id: string | number) => number {
                return (id) => Object.values(state.deckZones).reduce((count, zone) =>
                    count + zone.filter(card => card.id === id).length, 0
                );
            },

            getDeckRules(): DeckRules {
                return deckRules
            },

            getTotalCardCount(state): number {
                return Object.values(state.deckZones).reduce((count, zone) =>
                    count + zone.length, 0
                )
            }
        },

        actions: {
            async searchCards(query: string) {
                this.loading = true
                this.error = null

                try {
                    const result = await api.searchCards(query)

                    if (result.error) {
                        this.error = {
                            content: result.error,
                            timestamp: Date.now(),
                            type: 'error'
                        }
                        this.searchResults = []
                    } else {
                        // Map API data to standardized format
                        this.searchResults = result.data.map((card: any) =>
                            cardAdapter ? cardAdapter(card) : api.mapCardData(card)
                        )
                    }
                } catch (error) {
                    this.error = {
                        content: 'Failed to fetch cards. Please try again.',
                        timestamp: Date.now(),
                        type: 'error'
                    }
                    this.searchResults = []
                } finally {
                    this.loading = false
                }
            },
            selectCard(card: GenericCard): void {
                this.currentCard = card
            },

            canAddCard(card: GenericCard): { valid: boolean; error?: string | null; zone?: string } {
                if (customValidators?.validateDeckBeforeAdd) {
                    const result = customValidators.validateDeckBeforeAdd(this, card)
                    if (!result.valid) return {valid: false, error: result.error}
                }

                const targetZone = this.determineCardZone(card)

                if (!targetZone) {
                    return {
                        valid: false,
                        error: 'Could not determine the appropriate deck zone for this card'
                    }
                }

                const zoneRule = deckRules.zones.find(z => z.id === targetZone)

                if (zoneRule) {
                    if (customValidators?.validateZone) {
                        const result = customValidators.validateZone(this, card, targetZone, zoneRule)
                        if (!result.valid) return {valid: false, error: result.error}
                    } else if (zoneRule.maxCards && this.deckZones[targetZone].length >= zoneRule.maxCards) {
                        return {
                            valid: false,
                            error: `${zoneRule.name} cannot exceed ${zoneRule.maxCards} cards`
                        }
                    }
                }

                if (customValidators?.validateCardCopies) {
                    const result = customValidators.validateCardCopies(this, card)
                    if (!result.valid) return {valid: false, error: result.error}
                }

                return {valid: true, zone: targetZone}
            },

            addCardToDeck(card: GenericCard): boolean {

                this.error = null

                // Step 1: Valid the card
                const validation = this.canAddCard(card)
                if (!validation.valid) {
                    this.error = {
                        content: validation.error || 'Validation failed.',
                        timestamp: Date.now(),
                        type: 'error'
                    }
                    return false
                }

                const targetZone = validation.zone!

                // Step 2: Check for card count limits
                if (customValidators?.validateCardCopies) {
                    const copyValidation = customValidators.validateCardCopies(this, card)
                    if (!copyValidation.valid) {
                        this.error = {
                            content: copyValidation.error,
                            timestamp: Date.now(),
                            type: 'error'
                        }
                        return false
                    }
                }

                // Step 3: Clone the card and add a unique key for Vue rendering
                let cardToAdd = {...card} as GenericCard

                // Hook before add
                if (customCardProcessors?.processCardBeforeAdd) {
                    cardToAdd = customCardProcessors.processCardBeforeAdd(this, cardToAdd)
                }

                this.deckZones[targetZone].push(cardToAdd)

                // Hook after add
                if (customCardProcessors?.processAfterCardAdded) {
                    customCardProcessors.processAfterCardAdded(this, cardToAdd)
                }

                return true
            },

            determineCardZone(card: GenericCard): string {

                if (customCardProcessors?.determineCardZone) {
                    return customCardProcessors.determineCardZone(this, card)
                }

                for (const zone of deckRules.zones) {
                    if (zone.cardFilter(card)) {
                        return zone.id
                    }
                }
                return deckRules.defaultZone
            },

            removeCardFromDeck(id: string | number): boolean {

                if (!this.isCardInDeck(id)) return false

                // Hook before remove
                if (customCardProcessors?.beforeCardRemove) {
                    customCardProcessors.beforeCardRemove(this, id)
                }

                for (const zoneId in this.deckZones) {
                    const index = this.deckZones[zoneId].findIndex(card => card.id === id)
                    if (index !== -1) {

                        // Remove the card
                        const removedCard = this.deckZones[zoneId][index]
                        this.deckZones[zoneId].splice(index, 1)

                        // Hook after remove
                        if (customCardProcessors?.afterCardRemove) {
                            customCardProcessors.afterCardRemove(this, removedCard)
                        }

                        return true
                    }
                }
                return false
            }
        }
    })
}