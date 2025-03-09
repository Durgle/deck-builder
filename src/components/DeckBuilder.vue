<script setup>
import {ref, computed, defineAsyncComponent} from 'vue';
import DefaultCard from "@/components/cardTemplates/DefaultCard.vue";
import Input from "@/components/Input.vue";
import {CirclePlus} from "lucide-vue-next";
import {CircleMinus} from "lucide-vue-next";

const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
    gameType: {
        type: String,
        default: 'Default'
    },
    selectedItems: {
        type: Array,
        default: [],
    },
    rules: {
        type: Array,
        default: [],
    },
});

const searchText = ref("");
const currentSource = ref("");
const currentCard = ref(null);
const deckName = ref("");
const getCardTemplateComponent = () => {
    return defineAsyncComponent(
        () => import(`@/components/cardTemplates/${props.gameType}Card.vue`)
    );
};

const startDrag = (event, card, source) => {
    event.dataTransfer.setData('source', source)
    event.dataTransfer.setData('card', JSON.stringify(card));
    selectCard(card)
    currentSource.value = source;
};

const onDrop = (event, target) => {
    const source = event.dataTransfer.getData('source');
    currentSource.value = '';
    if (source !== target && event.dataTransfer.getData('card')) {
        const card = JSON.parse(event.dataTransfer.getData('card'));
        if (!props.rules.some(rule => rule(card, props.selectedItems))) {
            props.selectedItems.push(card);
        }
    }
};

const removeCardFromDeck = (event, target) => {
    const source = event.dataTransfer.getData('source');
    currentSource.value = '';
    if (source !== target) {
        const card = JSON.parse(event.dataTransfer.getData('card'));
        const index = props.selectedItems.findIndex(item => item.id === card.id);
        if (index !== -1) {
            props.selectedItems.splice(index, 1);
        }
    }
};

const getImageUrl = (image) => {
    const path = `../${image}`;
    return new URL(path, import.meta.url).href;
};

const orderedSelectedItems = computed(() => {
    return props.selectedItems.sort((a, b) => a.name.localeCompare(b.name));
});

const orderedItems = computed(() => {
    return props.items.filter((card) => {
        return card.name.toLowerCase().includes(searchText.value)
    })
});

const selectCard = (card) => {
    currentCard.value = card;
};

const getImgUrl = ((imagePath) => {
    const path = `/src/${imagePath}`;
    return new URL(path, import.meta.url).href
});
</script>

<template>
    <div class="deck-builder">
        <div class="container card-preview">
            <DefaultCard v-if="currentCard" :card="currentCard"/>
        </div>
        <div class="container deck">
            <Input v-model="deckName" placeholder="Deck name"/>
            <div class="deck-wrapper">
                <div
                    class="drop-zone"
                    @drop="onDrop($event,'deck')"
                    @dragover.prevent
                >
                    <div
                        v-for="card in orderedSelectedItems"
                        :key="card.id"
                        class="card"
                        :draggable="true"
                        @click="selectCard(card)"
                        @dragstart="startDrag($event, card,'deck')">
                        <img :src="getImgUrl(card.image)" :alt="card.name" class="card-image"/>
                    </div>
                    <div v-if="currentSource === 'cardList'" class="overlay">
                        <CirclePlus size="40"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="container card-list">
            <Input v-model="searchText" placeholder="Search a card" :clearable="true"/>
            <div class="card-list-wrapper">
                <div
                    class="drop-zone"
                    @drop="removeCardFromDeck($event,'cardList')"
                    @dragover.prevent
                >
                    <div
                        v-for="card in orderedItems"
                        :key="card.id"
                        class="card"
                        :draggable="true"
                        @click="selectCard(card)"
                        @dragstart="startDrag($event, card,'cardList')">
                        <img :src="getImgUrl(card.image)" :alt="card.name" class="card-image"/>
                    </div>
                    <!--                    <component-->
                    <!--                        :is="getCardTemplateComponent()"-->
                    <!--                        :card="card"-->
                    <!--                        draggable="true"-->
                    <!--                        @dragstart="startDrag($event, card, 'card-list')"-->
                    <!--                    />-->
                    <div v-if="currentSource === 'deck'" class="overlay">
                        <CircleMinus size="40"/>
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