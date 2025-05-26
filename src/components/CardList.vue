<template>
    <div class="card-list flex flex-col h-full">
        <FlashMessage v-if="error" :message="error"/>

        <SearchBar :store="store"/>

        <div class="flex-1 scroll relative">
            <div v-if="loading" class="flex flex-col items-center my-8 gap-2">
                <div class="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"></div>
                <div>Loading ...</div>
            </div>

            <div v-else-if="cards.length === 0" class="m-2">
                No cards found.
            </div>

            <div v-else
                 class="grid grid-cols-6 gap-2 p-2"
                 @dragover.prevent
                 @dragenter="onDragEnter()"
                 @dragleave="onDragLeave()"
                 @drop="onDrop($event)"
            >
                <CardItem
                    v-for="card in cards"
                    :key="card.id"
                    :card="card"
                    :gameType="gameType"
                    :source="zoneName"
                    @click="selectCard(card)"
                    @dragCard="selectCard"
                />
            </div>
            <div v-if="isDroppable()"
                 class="sticky top-0 h-full w-full border-3 rounded-sm inset-0 flex justify-center items-center z-10 pointer-events-none bg-black/30"
                 :class="{ 'bg-white/30 border-red-400' : isHovering() }"
            >
                <CircleMinus :size="40" class="bg-white p-1 rounded-full stroke-red-400"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed, onMounted} from 'vue'
import CardItem from './CardItem.vue'
import SearchBar from './SearchBar.vue'
import type {CardStore} from '@/types/store'
import type {GameType, GenericCard} from '@/types/card'
import {CircleMinus} from "lucide-vue-next";
import {useDropZone} from "@/composables/useDropZone";
import {DragPayload} from "@/types/drag";
import FlashMessage from "@/components/FlashMessage.vue";


/**
 * Props definition.
 *
 * @prop {CardStore} store - The Card store
 */
const props = defineProps<{
    store: CardStore
}>();

const cards = computed(() => props.store.searchResults);
const loading = computed(() => props.store.loading);
const error = computed(() => props.store.error);
const gameType = computed(() => props.store.gameType as GameType);
const zoneName = 'card-list';

const {onDragEnter, onDragLeave, isHovering, isDroppable, onDrop} = useDropZone(zoneName, handleDrop);

/**
 * Handles drop event
 * Removes card from deck only if gameType matches.
 */
function handleDrop(data: DragPayload) {
    if (data.gameType !== gameType.value) return;
    props.store.removeCardFromDeck(data.card.id);
}

/**
 * Selects a card in the store
 */
const selectCard = (card: GenericCard) => {
    props.store.selectCard(card);
}

onMounted(() => {
    props.store.searchCards('');
})
</script>