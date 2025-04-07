<script setup lang="ts">
import {onMounted, reactive} from 'vue';
import Input from "@/components/Input.vue";
import CardPreview from "@/components/CardPreview.vue";
import {CircleMinus, CirclePlus} from "lucide-vue-next";
import {Card} from "@/types/card";
import {CardGame} from "@/enums/cardGame";
import {useDeckStore} from "@/store/deckStore";

const deckStore = useDeckStore();

/**
 * Represents the state of the drag and drop
 *
 * @interface DeckBuilderState
 */
interface DragAndDropState {

    /**
     * The source of the card being dragged (e.g., "deck", "library").
     * @type {string}
     */
    dragSource: string;

    /**
     * Indicates whether a card is being dragged over the deck
     * @type {boolean}
     */
    dragOverDeck: boolean;

    /**
     * Indicates whether a card is being dragged over the library
     * @type {boolean}
     */
    dragOverLibrary: boolean;

    /**
     * The counter for drag events related to the deck.
     * @type {number}
     */
    deckDragCounter: number;

    /**
     * The counter for drag events related to the library.
     * @type {number}
     */
    libraryDragCounter: number;
}

/**
 * Represents the state of the deck builder
 *
 * @interface DeckBuilderState
 */
interface DeckBuilderState {

    /**
     * The drag-and-drop
     * @type {DragAndDropState}
     */
    dragAndDropState: DragAndDropState;
}

/**
 * The reactive state object that manages the deck builder's state.
 *
 * @type {DeckBuilderState}
 */
const state: DeckBuilderState = reactive({
    dragAndDropState: {
        dragSource: "",
        dragOverDeck: false,
        dragOverLibrary: false,
        deckDragCounter: 0,
        libraryDragCounter: 0
    }
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
        state.dragAndDropState.dragSource = source;
        deckStore.selectCard(card);
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
        if (source !== targetZone && cardId) {
            if (targetZone === "deck") deckStore.addCard(cardId);
            if (targetZone === "library") deckStore.removeCard(cardId);
        }
    }
    state.dragAndDropState.dragSource = '';
    state.dragAndDropState.dragOverDeck = false;
    state.dragAndDropState.dragOverLibrary = false;
    state.dragAndDropState.deckDragCounter = 0;
    state.dragAndDropState.libraryDragCounter = 0;
};

/**
 * Handles the event when a draggable element enters the deck drop zone.
 */
const onDragEnterDeck = () => {
    state.dragAndDropState.deckDragCounter++;
    state.dragAndDropState.dragOverDeck = true;
}

/**
 * Handles the event when a draggable element leaves the deck drop zone.
 */
const onDragLeaveDeck = () => {
    state.dragAndDropState.deckDragCounter--;
    if (state.dragAndDropState.deckDragCounter === 0) {
        state.dragAndDropState.dragOverDeck = false;
    }
}

/**
 * Handles the event when a draggable element enters the library drop zone.
 */
const onDragEnterLibrary = () => {
    state.dragAndDropState.libraryDragCounter++;
    state.dragAndDropState.dragOverLibrary = true;
}

/**
 * Handles the event when a draggable element leaves the library drop zone.
 */
const onDragLeaveLibrary = () => {
    state.dragAndDropState.libraryDragCounter--;
    if (state.dragAndDropState.libraryDragCounter === 0) {
        state.dragAndDropState.dragOverLibrary = false;
    }
}

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
    deckStore.initializeStore(props.cardGame as CardGame);
});

</script>

<template>
    <div class="flex flex-1 gap-2 bg-red-100 p-2 h-200 text-x-font bg-x-primary">
        <div class="flex flex-col p-2 w-7/30">
            <div class="flex-1 bg-x-secondary rounded-md overflow-auto">
                <CardPreview v-if="deckStore.currentCard" :card="deckStore.currentCard" :cardGame="cardGame"
                             @addCard="deckStore.addCard"
                             @removeCard="deckStore.removeCard"/>
            </div>
        </div>
        <div class="flex flex-col p-2 w-7/15">
            <Input v-model="deckStore.deckName" placeholder="Deck name"/>
            <div class="flex flex-1 overflow-y-auto bg-x-secondary rounded-md">
                <div
                    class="flex flex-col flex-grow gap-2 relative h-full overflow-hidden"
                    @drop="onDrop($event,'deck')"
                    @dragenter="onDragEnterDeck"
                    @dragleave="onDragLeaveDeck"
                    @dragover.prevent
                >
                    <h2 class="py-2 px-4 text-xl font-bold bg-x-secondary-lighter shadow-md">{{ mainZoneName }}</h2>
                    <div :class="{'h-3/5': enableSecondZone}"
                         class="p-2 grid grid-cols-10 auto-rows-min gap-2 w-full rounded-lg overflow-auto
                                scrollbar scrollbar-thumb-x-primary scrollbar-track-x-secondary scrollbar-thin">
                        <div
                            v-for="(card, index) in deckStore.getSelectedCards.deck"
                            :key="`deck-${card.id}-${index}`"
                            class="cursor-grab shadow-md relative after:absolute after:inset-0 after:bg-white after:opacity-0 after:transition-opacity hover:after:opacity-25"
                            :draggable="true"
                            @click="deckStore.selectCard(card)"
                            @dblclick="deckStore.removeCard(card.id)"
                            @dragstart="onDragStart($event, card,'deck')">
                            <img :src="card.image" :alt="card.name" class="rounded-sm"/>
                        </div>
                    </div>
                    <h2 v-if="enableSecondZone" class="py-2 px-4 text-xl font-bold bg-x-secondary-lighter shadow-md">
                        {{ secondZoneName }}</h2>
                    <div v-if="enableSecondZone" class="p-2 grid grid-cols-10 auto-rows-min gap-2 w-full h-2/5 rounded-lg overflow-auto
                            scrollbar scrollbar-thumb-x-primary scrollbar-track-x-secondary scrollbar-thin">
                        <div
                            v-for="(card, index) in deckStore.getSelectedCards.extra"
                            :key="`deck-${card.id}-${index}`"
                            class="shadow-md"
                            :draggable="true"
                            @click="deckStore.selectCard(card)"
                            @dblclick="deckStore.removeCard(card.id)"
                            @dragstart="onDragStart($event, card,'deck')">
                            <img :src="card.image" :alt="card.name" class="rounded-sm"/>
                        </div>
                    </div>
                    <div v-if="state.dragAndDropState.dragSource === 'library'"
                         class="absolute border-3 rounded-sm inset-0 flex justify-center items-center z-10 pointer-events-none"
                         :class="state.dragAndDropState.dragOverDeck ? 'bg-white/10 border-x-green' : 'bg-black/30'">
                        <CirclePlus :size="40" class="bg-white p-1 rounded-full stroke-x-green"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col p-2 w-3/10">
            <Input v-model="deckStore.searchText" placeholder="Search a card" :clearable="true"/>
            <div class="flex flex-1 overflow-y-auto bg-x-secondary rounded-md relative">
                <div
                    class="p-2 grid grid-cols-6 auto-rows-min gap-2 w-full rounded-lg overflow-auto
                           scrollbar scrollbar-thumb-x-primary scrollbar-track-x-secondary scrollbar-thin"
                    @drop="onDrop($event,'library')"
                    @dragenter="onDragEnterLibrary"
                    @dragleave="onDragLeaveLibrary"
                    @dragover.prevent
                >
                    <div
                        v-for="card in deckStore.getFilteredCard"
                        :key="card.id"
                        class="cursor-grab shadow-md relative after:absolute after:inset-0 after:bg-white after:opacity-0 after:transition-opacity hover:after:opacity-25"
                        :draggable="true"
                        @click="deckStore.selectCard(card)"
                        @dblclick="deckStore.addCard(card.id)"
                        @dragstart="onDragStart($event, card,'library')">
                        <img :src="card.image" :alt="card.name" class="rounded-sm"/>
                    </div>
                    <div v-if="state.dragAndDropState.dragSource === 'deck'"
                         class="border-3 rounded-sm absolute inset-0 flex justify-center items-center z-10 pointer-events-none"
                         :class="state.dragAndDropState.dragOverLibrary ? 'bg-white/10 border-x-red' : 'bg-black/30'">
                        <CircleMinus :size="40" class="bg-white p-1 rounded-full stroke-x-red"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>