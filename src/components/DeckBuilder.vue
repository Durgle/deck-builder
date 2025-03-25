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
import {CardRule} from "@/types/cardRule";
import {cardRules} from "@/utils/cardRules";

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
     * An array of card rules to apply to the card.
     * @type {CardRule[]}
     */
    secondZoneRules: CardRule[];

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
    secondZoneRules: [],
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
    return state.selectedItems
        .map(id => state.items[id])
        .filter(card => !state.secondZoneRules.some(rule => rule(card)))
        .sort((a, b) => a.name.localeCompare(b.name));
});

/**
 * Computed that returns a sorted array of the selected items.
 * The items are sorted alphabetically by their `name` property.
 *
 * @type {ComputedRef<Card[]>}
 * @returns {Card[]} A sorted array of selected items based on their `name` property.
 */
const sortedSelectedSecondItems: ComputedRef<Card[]> = computed(() => {
    return state.selectedItems
        .map(id => state.items[id])
        .filter(card => state.secondZoneRules.some(rule => rule(card)))
        .sort((a, b) => a.name.localeCompare(b.name));
});

/**
 * Computed that returns a sorted array of the selected items.
 * The items are sorted alphabetically by their `name` property.
 *
 * @type {ComputedRef<Card[]>}
 * @returns {Card[]} A sorted array of selected items based on their `name` property.
 */
const sortedSecondItems: ComputedRef<Card[]> = computed(() => {
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
    mainZoneName: {
        type: String,
        default: "Deck"
    },
    secondZoneName: {
        type: String,
        default: null
    },
    enableSecondZone: {
        type: Boolean,
        default: false
    }
});

onMounted(() => {
    if (props.cardGame === CardGame.YUGIOH) {
        state.items = yugiohCards;
        state.rules = deckRules;
        state.secondZoneRules = cardRules;
    } else {
        state.items = cards;
    }
});

</script>

<template>
    <div class="flex flex-1 gap-2 bg-red-100 p-2 h-200 text-x-font bg-x-primary">
        <div class="flex flex-col p-2 w-1/4">
            <div class="flex-1 bg-x-secondary rounded-md overflow-auto">
                <CardPreview v-if="state.currentCard" :card="state.currentCard" :cardGame="cardGame" @addCard="addCard"
                             @removeCard="removeCard"/>
            </div>
        </div>
        <div class="flex flex-col p-2 w-1/2">
            <Input v-model="state.deckName" placeholder="Deck name"/>
            <div class="flex flex-1 overflow-y-auto bg-x-secondary rounded-md">
                <div
                    class="flex flex-col flex-grow gap-2 relative h-full overflow-hidden"
                    @drop="onDrop($event,'deck')"
                    @dragover.prevent
                >
                    <h2 class="py-2 px-4 text-xl font-bold bg-x-secondary-lighter shadow-md">{{ mainZoneName }}</h2>
                    <div :class="{'h-3/5': enableSecondZone}"
                        class="p-2 grid grid-cols-10 auto-rows-min gap-2 w-full rounded-lg overflow-auto
                                scrollbar scrollbar-thumb-x-primary scrollbar-track-x-secondary scrollbar-thin">
                        <div
                            v-for="(card, index) in sortedSelectedItems"
                            :key="`deck-${card.id}-${index}`"
                            class="cursor-grab shadow-md relative after:absolute after:inset-0 after:bg-white after:opacity-0 after:transition-opacity hover:after:opacity-25"
                            :draggable="true"
                            @click="selectCard(card)"
                            @dblclick="removeCard(card.id)"
                            @dragstart="onDragStart($event, card,'deck')">
                            <img :src="card.image" :alt="card.name" class="rounded-sm"/>
                        </div>
                    </div>
                    <h2 v-if="enableSecondZone" class="py-2 px-4 text-xl font-bold bg-x-secondary-lighter shadow-md">{{ secondZoneName }}</h2>
                    <div v-if="enableSecondZone" class="p-2 grid grid-cols-10 auto-rows-min gap-2 w-full h-2/5 rounded-lg overflow-auto
                            scrollbar scrollbar-thumb-x-primary scrollbar-track-x-secondary scrollbar-thin">
                        <div
                            v-for="(card, index) in sortedSelectedSecondItems"
                            :key="`deck-${card.id}-${index}`"
                            class="shadow-md"
                            :draggable="true"
                            @click="selectCard(card)"
                            @dblclick="removeCard(card.id)"
                            @dragstart="onDragStart($event, card,'deck')">
                            <img :src="card.image" :alt="card.name" class="rounded-sm"/>
                        </div>
                    </div>
                    <div v-if="state.dragSource === 'library'"
                         class="absolute border-3 rounded-sm inset-0 bg-black/50 flex justify-center items-center z-10 pointer-events-none">
                        <CirclePlus :size="40" class="fill-x-green stroke-stone-950"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col p-2 w-1/4">

            <Input v-model="state.searchText" placeholder="Search a card" :clearable="true"/>
            <div class="flex flex-1 overflow-y-auto bg-x-secondary rounded-md relative">
                <div
                    class="p-2 grid grid-cols-5 auto-rows-min gap-2 w-full rounded-lg overflow-auto
                                scrollbar scrollbar-thumb-x-primary scrollbar-track-x-secondary scrollbar-thin"
                    @drop="onDrop($event,'library')"
                    @dragover.prevent
                >
                    <div
                        v-for="card in filteredItems"
                        :key="card.id"
                        class="cursor-grab shadow-md relative after:absolute after:inset-0 after:bg-white after:opacity-0 after:transition-opacity hover:after:opacity-25"
                        :draggable="true"
                        @click="selectCard(card)"
                        @dblclick="addCard(card.id)"
                        @dragstart="onDragStart($event, card,'library')">
                        <img :src="card.image" :alt="card.name" class="rounded-sm"/>
                    </div>
                    <div v-if="state.dragSource === 'deck'"
                         class="border-3 rounded-sm absolute inset-0 bg-black/50 flex justify-center items-center z-10 pointer-events-none">
                        <CircleMinus :size="40" class="fill-x-red stroke-stone-950"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>