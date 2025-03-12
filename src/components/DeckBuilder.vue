<script setup lang="ts">
import {ref, computed, onMounted, reactive} from 'vue';
import Input from "@/components/Input.vue";
import CardPreview from "@/components/CardPreview.vue";
import {CirclePlus} from "lucide-vue-next";
import {CircleMinus} from "lucide-vue-next";
import {Card} from "@/types/card";
import {DeckRule} from "@/types/deckRule";
import cards from '@/assets/data/cards.json';
import yugiohCards from '@/assets/data/yugiohCards.json';
import {deckRules} from "@/utils/deckRules";

const props = defineProps({
    cardGame: {
        type: String,
        default: null
    },
});

interface DeckBuilderState {
    currentCard: Card | null,
    deckName: string,
    items: Card[],
    selectedItems: Card[],
    rules: DeckRule[],
    searchText: string,
    dragSource: string
}

const state: DeckBuilderState = reactive({
    currentCard: null,
    deckName: "",
    items: [],
    selectedItems: [],
    rules: [],
    searchText: "",
    dragSource: ""
});

const startDrag = (event: DragEvent, card: Card, source: string) => {
    selectCard(card)
    state.dragSource = source;

    if (event.dataTransfer) {
        event.dataTransfer.setData('source', source)
        event.dataTransfer.setData('card', JSON.stringify(card));
        event.dataTransfer.setDragImage(event.target as HTMLElement, 25, 30);
    }
};

const onDrop = (event: DragEvent, target: string) => {
    const source = event.dataTransfer?.getData('source');
    state.dragSource = '';
    if (source !== target && event.dataTransfer?.getData('card')) {
        const card = JSON.parse(event.dataTransfer.getData('card'));
        addCard(card);
    }
};

const addCard = (card: Card) => {
    if (!state.rules?.some(rule => rule(card, state.selectedItems))) {
        state.selectedItems.push(card);
    }
}

const removeCard = (card: Card) => {
    const index = state.selectedItems.findIndex(item => item.id === card.id);
    if (index !== -1) {
        state.selectedItems.splice(index, 1);
    }
}

const removeCardFromDeck = (event: DragEvent, target: string) => {
    const source = event.dataTransfer?.getData('source');
    state.dragSource = '';
    if (source !== target && event.dataTransfer) {
        const card = JSON.parse(event.dataTransfer.getData('card'));
        removeCard(card)
    }
};

const selectCard = (card: Card) => {
    state.currentCard = card;
};

const sortedSelectedItems = computed(() => {
    return state.selectedItems.sort((a, b) => a.name.localeCompare(b.name));
});

const filteredItems = computed(() => {
    return state.items.filter((card) => {
        return card.name.toLowerCase().includes(state.searchText)
    })
});

onMounted(() => {
    if (props.cardGame === 'Yugioh') {
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
                        v-for="card in sortedSelectedItems"
                        :key="card.id"
                        class="card"
                        :draggable="true"
                        @click="selectCard(card)"
                        @dblclick="removeCard(card)"
                        @dragstart="startDrag($event, card,'deck')">
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
                    @drop="removeCardFromDeck($event,'cardList')"
                    @dragover.prevent
                >
                    <div
                        v-for="card in filteredItems"
                        :key="card.id"
                        class="card"
                        :draggable="true"
                        @click="selectCard(card)"
                        @dblclick="addCard(card)"
                        @dragstart="startDrag($event, card,'cardList')">
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