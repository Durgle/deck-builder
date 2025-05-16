<template>
    <div class="deck-zones-container h-full flex flex-col relative">
        <div
            v-for="zone in deckRules.zones"
            :key="zone.id"
            class="deck-drop-zone flex flex-col min-h-0 flex-1"
            :class="{ cursor: isDroppable() ? 'cursor-pointer' : 'cursor-not-allowed' }"
            @dragover.prevent
            @dragenter="onDragEnter()"
            @dragleave="onDragLeave()"
            @drop="onDrop($event, zone.id)"
        >
            <h3 class="text-lg font-semibold py-2 px-4 bg-tan-600 text-tan-100 dark:bg-big-stone-900">
                {{ zone.name }}
            </h3>
            <div class="grid grid-cols-10 gap-2 m-2 scroll">
                <CardItem
                    v-for="card in store.getSortedDeck(zone.id)"
                    :key="card.id"
                    :card="card"
                    :gameType="gameType"
                    :source="zoneName"
                    @click="selectCard(card)"
                    @dragCard="selectCard"
                />
            </div>
        </div>
        <div v-if="isDroppable()"
             class="absolute border-3 rounded-sm inset-0 flex justify-center items-center z-10 pointer-events-none bg-black/30"
             :class="{ 'bg-white/30 border-green-400' : isHovering() }"
        >
            <CirclePlus :size="40" class="bg-white p-1 rounded-full stroke-green-400"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import CardItem from './CardItem.vue'
import type {GameType, GenericCard} from '@/types/card'
import type {CardStore} from '@/types/store'
import {CirclePlus} from "lucide-vue-next";
import {useDropZone} from "@/composables/useDropZone";

interface DragData {
    card: GenericCard
    gameType: GameType
}

const props = defineProps<{
    store: CardStore
}>()

const deckZones = computed(() => props.store.deckZones)
const deckRules = computed(() => props.store.getDeckRules)
const gameType = computed(() => props.store.gameType as GameType)
const zoneName = 'deck'

function handleDrop(data: DragData, _event: DragEvent, zoneId?: string) {
    if (!zoneId || data.gameType !== gameType.value) return
    props.store.addCardToDeck(data.card)
}

const {onDragEnter, onDragLeave, onDrop, isHovering, isDroppable} = useDropZone(zoneName, handleDrop)

function selectCard(card: GenericCard) {
    props.store.selectCard(card)
}
</script>