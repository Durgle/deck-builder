<template>
    <div class="card-list flex flex-col h-full">
        <FlashMessage v-if="error" :message="error"/>

        <SearchBar :store="store"/>

        <div ref="scrollContainer" class="flex-1 scroll relative">
            <div v-if="loading && cards.length === 0" class="flex flex-col items-center my-8 gap-2">
                <div class="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"></div>
                <div>Loading cards...</div>
            </div>

            <div v-else-if="cards.length === 0 && !loading" class="m-2">
                <p>No cards found.</p>
                <p class="text-sm mt-2">Try adjusting your search criteria.</p>
            </div>

            <div v-else
                 class="grid grid-cols-6 gap-2 p-2"
                 @dragover.prevent
                 @dragenter="onDragEnter()"
                 @dragleave="onDragLeave()"
                 @drop="onDrop"
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

            <div
                v-if="cards.length > 0 && !store.reachedEnd"
                ref="sentinelRef"
                class="h-10 flex items-center justify-center"
            />

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
import {computed, onMounted, ref, watch} from 'vue'
import CardItem from './CardItem.vue'
import SearchBar from './SearchBar.vue'
import type {CardStore} from '@/types/store'
import type {GameType, GenericCard} from '@/types/card'
import {CircleMinus} from "lucide-vue-next";
import {useDropZone} from "@/composables/useDropZone";
import {DragPayload} from "@/types/drag";
import FlashMessage from "@/components/FlashMessage.vue";
import {useInfiniteScroll} from "@/composables/useInfiniteScroll";


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
const reachedEnd = computed(() => props.store.reachedEnd)

const zoneName = 'card-list';
const scrollContainer = ref<HTMLElement | null>(null);

const {onDragEnter, onDragLeave, isHovering, isDroppable, onDrop} = useDropZone(zoneName, handleDrop);

const {sentinelRef, reinitialize} = useInfiniteScroll(
    async () => {
        await props.store.fetchNextPage()
    },
    loading,
    reachedEnd,
    {
        root: scrollContainer,
        rootMargin: '100px',
        contentThreshold: 1.3
    }
)

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

// Watch for changes that require observer reinitialization
watch(
    () => [cards.value.length, reachedEnd.value],
    async () => {
        await reinitialize()
    },
    {flush: 'post'}
)

// Watch for new searches to ensure proper reinitialization
watch(
    () => props.store.searchResults,
    async (newResults, oldResults) => {
        // Reinitialize on new search results
        if (newResults.length > 0 && (!oldResults || oldResults.length === 0)) {
            await reinitialize()
        }
    }
)

onMounted(async () => {
    try {
        await props.store.fetchCards('')
    } catch (error) {
        console.error('Error initializing cards:', error)
    }
})
</script>