<template>
    <div v-if="currentCard" class="card-viewer-zone h-full flex flex-col">
        <div class="p-2 scroll flex-1">
            <h3 class="text-lg font-bold mb-2">{{ currentCard.name }}</h3>

            <div class="flex flex-col items-center">
                <img
                    :src="currentCard.imageUrl || fallbackImage"
                    :alt="currentCard.name"
                    class="w-auto h-auto mb-4 rounded-sm shadow-md max-h-90"
                />

                <div class="w-full mt-2 text-sm bg-tan-100 dark:bg-big-stone-400 rounded">
                    <YugiohCard v-if="gameType === 'yugioh'" :card="currentCard"/>
                </div>
            </div>
        </div>
        <div class="p-2 flex gap-4 justify-center">
            <button
                class="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50 shadow-lg"
                :class="{'cursor-pointer hover:bg-green-700': canAddCard}"
                @click="addCurrentCard"
                :disabled="!canAddCard"
            >
                +1
            </button>

            <button
                class="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50 shadow-lg"
                :class="{'cursor-pointer hover:bg-red-700': canRemoveCard}"
                @click="removeCurrentCard"
                :disabled="!canRemoveCard"
            >
                -1
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed} from "vue"
import YugiohCard from "@/components/cardTemplates/YugiohCard.vue"
import type {CardStore} from "@/types/store"
import type {GameType, GenericCard} from "@/types/card"

const props = defineProps<{
    store: CardStore
}>()

const currentCard = computed(() => props.store.currentCard as GenericCard | null)
const gameType = computed(() => props.store.gameType as GameType)
const fallbackImage = 'https://placehold.co/150x200?text=No+Image';

function addCurrentCard() {
    if (currentCard.value) {
        props.store.addCardToDeck(currentCard.value);
    }
}

function removeCurrentCard() {
    if (currentCard.value) {
        props.store.removeCardFromDeck(currentCard.value.id);
    }
}

const canAddCard = computed(() =>
    currentCard.value ? props.store.canAddCard(currentCard.value).valid : false
)

const canRemoveCard = computed(() =>
    currentCard.value ? props.store.isCardInDeck(currentCard.value.id) : false
)

</script>