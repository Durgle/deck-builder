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
        state.dragSource = source;
        selectCard(card);
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
            if (targetZone === "deck") addCard(cardId);
            if (targetZone === "library") removeCard(cardId);
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
    if (index !== -1) state.selectedItems.splice(index, 1);
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
const sortedSelectedItems: ComputedRef<Card[]> = computed(() => {
    return state.selectedItems.map(id => state.items[id]).sort((a, b) => a.name.localeCompare(b.name));
});

/**
 * Computed that filters the items based on the search text.
 * The items are filtered by their `name` property
 *
 * @type {ComputedRef<Card[]>}
 * @returns {Card[]} An array of cards filtered
 */
const filteredItems: ComputedRef<Card[]> = computed(() => {
    return Object.values(state.items).filter((card) => card.name.toLowerCase().includes(state.searchText));
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
    <div class="flex flex-1 gap-2 bg-yellow-400 p-2 min-h-60">
        <div class="flex flex-col p-2 bg-red-600 w-1/4">
            <div v-if="state.currentCard" class="preview-container">
                <CardPreview :card="state.currentCard" :cardGame="cardGame" @addCard="addCard"
                             @removeCard="removeCard"/>
            </div>
        </div>
        <div class="flex flex-col p-2 bg-blue-600 w-1/2">
            <Input v-model="state.deckName" placeholder="Deck name"/>
            <div class="flex flex-1">
                <div
                    class="p-2 bg-pink-300 flex-1 flex-wrap gap-2 justify-center relative grid grid-cols-10 auto-rows-min select-none"
                    @drop="onDrop($event,'deck')"
                    @dragover.prevent
                >
                    <div
                        v-for="(card, index) in sortedSelectedItems"
                        :key="`deck-${card.id}-${index}`"
                        class="flex flex-col cursor-grab relative after:absolute after:inset-0 after:bg-white after:opacity-0 after:transition-opacity hover:after:opacity-25"
                        :draggable="true"
                        @click="selectCard(card)"
                        @dblclick="removeCard(card.id)"
                        @dragstart="onDragStart($event, card,'deck')">
                        <img :src="card.image" :alt="card.name" class="rounded-sm"/>
                    </div>
                    <div v-if="state.dragSource === 'library'" class="absolute inset-0 bg-white/40 flex justify-center items-center z-10 pointer-events-none">
                        <CirclePlus :size="40" class="fill-green-400" />
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col p-2 bg-green-600 w-1/4">
            <Input v-model="state.searchText" placeholder="Search a card" :clearable="true"/>
            <div class="flex flex-1">
                <div
                    class="p-2 bg-pink-300 flex-1 flex-wrap gap-2 justify-center relative grid grid-cols-5 auto-rows-min select-none"
                    @drop="onDrop($event,'library')"
                    @dragover.prevent
                >
                    <div
                        v-for="card in filteredItems"
                        :key="card.id"
                        class="flex flex-col cursor-grab relative after:absolute after:inset-0 after:bg-white after:opacity-0 after:transition-opacity hover:after:opacity-25 after:rounded-sm"
                        :draggable="true"
                        @click="selectCard(card)"
                        @dblclick="addCard(card.id)"
                        @dragstart="onDragStart($event, card,'library')">
                        <img :src="card.image" :alt="card.name" class="rounded-sm"/>
                    </div>
                    <div v-if="state.dragSource === 'deck'" class="absolute inset-0 bg-white/40 flex justify-center items-center z-10 pointer-events-none">
                        <CircleMinus :size="40" class="fill-red-400" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>