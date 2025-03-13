<script setup lang="ts">
import {computed, ComputedRef, onMounted, reactive} from 'vue';
import Input from "@/components/Input.vue";
import CardPreview from "@/components/CardPreview.vue";
import {CirclePlus} from "lucide-vue-next";
import {CircleMinus} from "lucide-vue-next";
import {Card} from "@/types/card";
import {DeckRule} from "@/types/deckRule";
import cards from '@/assets/data/cards.json';
import yugiohCards from '@/assets/data/yugiohCards.json';
import {deckRules} from "@/utils/deckRules";
import {CardGame} from "@/enums/cardGame";

/**
 * Represents the state of the deck builder
 *
 * @interface DeckBuilderState
 */
interface DeckBuilderState {

    /**
     * The currently selected card in the deck builder or null if no card is selected.
     * @type {Card | null}
     */
    currentCard: Card | null;

    /**
     * The name of the deck being created or edited.
     * @type {string}
     */
    deckName: string;

    /**
     * A dictionary of card items in the deck, keyed by a string identifier.
     * @type {{ [key: string]: Card }}
     */
    items: { [key: string]: Card };

    /**
     * An array of the IDs of the currently selected items in the deck builder.
     * @type {number[]}
     */
    selectedItems: number[];

    /**
     * An array of deck rules to apply to the deck.
     * @type {DeckRule[]}
     */
    rules: DeckRule[];

    /**
     * The search text input by the user to filter the deck items.
     * @type {string}
     */
    searchText: string;

    /**
     * The source of the card being dragged (e.g., "deck", "library").
     * @type {string}
     */
    dragSource: string;
}

/**
 * The reactive state object that manages the deck builder's state.
 *
 * @type {DeckBuilderState}
 */
const state: DeckBuilderState = reactive({
    currentCard: null,
    deckName: "",
    items: {},
    selectedItems: [],
    rules: [],
    searchText: "",
    dragSource: ""
});

/**
 * Handles the drag start event for a card, setting up the drag operation.
 *
 * @param {DragEvent} event - The drag event triggered when a card starts being dragged.
 * @param {Card} card - The card being dragged.
 * @param {string} source - The source zone from where the card is being dragged (e.g., "deck", "library").
 */
const onDragStart = (event: DragEvent, card: Card, source: string) => {
    if (event.dataTransfer) {
        selectCard(card)
        event.dataTransfer.setDragImage(event.target as HTMLElement, 25, 30);
        event.dataTransfer.setData('text/plain', JSON.stringify({source, cardId: card.id}));
    }
};

/**
 * Handles the drop event for dragging and dropping cards between different zones.
 *
 * @param {DragEvent} event - The drag event triggered when a card is dropped.
 * @param {string} targetZone - The zone where the card is being dropped (e.g., "deck", "library").
 */
const onDrop = (event: DragEvent, targetZone: string) => {
    if (event.dataTransfer) {
        const {source, cardId} = JSON.parse(event.dataTransfer.getData('text/plain'));
        state.dragSource = '';
        if (source !== targetZone && cardId) {
            if (targetZone === "deck") {
                addCard(cardId);
            }
            if (targetZone == "library") {
                removeCard(cardId)
            }
        }
    }
};

/**
 * Adds a card to the selected items list if it meets the defined rules.
 *
 * @param {number} cardId - The ID of the card to be added.
 */
const addCard = (cardId: number) => {
    if (!state.rules?.some(rule => rule(cardId, state.selectedItems))) {
        state.selectedItems.push(cardId);
    }
}

/**
 * Removes a card from the selected items list by its card ID.
 *
 * @param {number} cardId - The ID of the card to be removed from the selected items.
 */
const removeCard = (cardId: number) => {
    const index = state.selectedItems.indexOf(cardId);
    if (index !== -1) {
        state.selectedItems.splice(index, 1);
    }
}

/**
 * Selects a card and sets it as the current card in the state.
 *
 * @param {Card} card - The card to be selected.
 */
const selectCard = (card: Card) => {
    state.currentCard = card;
};

/**
 * Computed that returns a sorted array of the selected items.
 * The items are sorted alphabetically by their `name` property.
 *
 * @type {ComputedRef<Card[]>}
 * @returns {Card[]} A sorted array of selected items based on their `name` property.
 */
const sortedSelectedItems:ComputedRef<Card[]> = computed(() => {
    return state.selectedItems
        .map(id => state.items[id])
        .sort((a, b) => a.name.localeCompare(b.name));
});

/**
 * Computed that filters the items based on the search text.
 * The items are filtered by their `name` property
 *
 * @type {ComputedRef<Card[]>}
 * @returns {Card[]} An array of cards filtered
 */
const filteredItems:ComputedRef<Card[]> = computed(() => {
    return Object.values(state.items).filter((card) => {
        return card.name.toLowerCase().includes(state.searchText)
    })
});

/**
 * The props object for the component.
 */
const props = defineProps({
    cardGame: {
        type: String,
        default: null
    },
});

onMounted(() => {
    if (props.cardGame === CardGame.YUGIOH) {
        state.items = yugiohCards;
        state.rules = deckRules;
    } else {
        state.items = cards;
    }
});

</script>

<template>
    <div class="deck-builder">
        <div class="container card-preview">
            <div v-if="state.currentCard" class="preview-container">
                <CardPreview :card="state.currentCard" :cardGame="cardGame" @addCard="addCard"
                             @removeCard="removeCard"/>
            </div>
        </div>
        <div class="container deck">
            <Input v-model="state.deckName" placeholder="Deck name"/>
            <div class="deck-wrapper">
                <div
                    class="drop-zone"
                    @drop="onDrop($event,'deck')"
                    @dragover.prevent
                >
                    <div
                        v-for="(card, index) in sortedSelectedItems"
                        :key="`deck-${card.id}-${index}`"
                        class="card"
                        :draggable="true"
                        @click="selectCard(card)"
                        @dblclick="removeCard(card.id)"
                        @dragstart="onDragStart($event, card,'deck')">
                        <img :src="card.image" :alt="card.name" class="card-image"/>
                    </div>
                    <div v-if="state.dragSource === 'cardList'" class="overlay">
                        <CirclePlus :size="40"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="container card-list">
            <Input v-model="state.searchText" placeholder="Search a card" :clearable="true"/>
            <div class="card-list-wrapper">
                <div
                    class="drop-zone"
                    @drop="onDrop($event,'library')"
                    @dragover.prevent
                >
                    <div
                        v-for="card in filteredItems"
                        :key="card.id"
                        class="card"
                        :draggable="true"
                        @click="selectCard(card)"
                        @dblclick="addCard(card.id)"
                        @dragstart="onDragStart($event, card,'library')">
                        <img :src="card.image" :alt="card.name" class="card-image"/>
                    </div>
                    <div v-if="state.dragSource === 'deck'" class="overlay">
                        <CircleMinus :size="40"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.deck-builder {
    --x-space-arround: 10px;
    background-color: yellow;
    padding: var(--x-space-arround);
    min-height: 600px;
    display: flex;
    gap: var(--x-space-arround);
}

.container.card-preview {
    background-color: red;
    width: 0;
    flex-grow: 1;
    order: 1;
}

.container.deck {
    background-color: blue;
    width: 0;
    flex-grow: 2;
    order: 2;
}

.container.card-list {
    background-color: green;
    width: 0;
    flex-grow: 1;
    order: 3;
}

.container {
    padding: 10px;
    display: flex;
    flex-direction: column;
}

.drop-zone {
    padding: 10px;
    color: black;
    background-color: pink;
    position: relative;
    flex: 1;
    flex-wrap: wrap;
    display: grid;
    grid-template-columns: repeat(auto-fill, 50px);
    grid-template-rows: repeat(auto-fill, 70px);
    grid-gap: 10px 5px;
    justify-content: center;
    user-select: none;
}

.card-list-wrapper, .deck-wrapper {
    flex: 1;
    display: flex;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #FFFFFF44;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    pointer-events: none;
}

.card {
    display: flex;
    flex-direction: column;
    position: relative;
    cursor: grab;
}

.card::after {
    content: '';
    position: absolute;
    border-radius: 5px;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #FFFFFF;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.card:hover::after {
    opacity: 0.3;
}

.card img {
    width: 50px;
    max-height: 70px;
    border-radius: 2px;
    transition: opacity 0.3s ease;
}

.card :hover img {
    opacity: 0.8;
}
</style>