<template>
    <div v-if="currentCard" class="card-viewer-zone h-full flex flex-col">

        <!-- Card image and details -->
        <div class="p-2 scroll flex-1 flex flex-col gap-4">

            <h3 class="text-lg font-bold text-center">{{ currentCard.name }}</h3>

            <div class="flex flex-col items-center">
                <img
                    :src="currentCard.imageUrl || fallbackImage"
                    :alt="currentCard.name"
                    class="w-auto h-auto rounded-sm shadow-md max-h-80"
                />
            </div>

            <!-- Game-specific card display -->
            <div class="w-full text-sm">
                <YugiohCard v-if="gameType === 'yugioh'" :card="currentCard"/>
            </div>

        </div>

        <!-- Add/remove buttons -->
        <div class="p-2 flex gap-4 justify-center">
            <button
                class="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50 shadow-lg"
                :class="{'cursor-pointer hover:bg-green-700': canAddCard}"
                @click="addCurrentCard"
                :disabled="!canAddCard"
                aria-label="Add card to deck"
            > +1
            </button>

            <button
                class="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50 shadow-lg"
                :class="{'cursor-pointer hover:bg-red-700': canRemoveCard}"
                @click="removeCurrentCard"
                :disabled="!canRemoveCard"
                aria-label="Remove card from deck"
            > -1
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed} from "vue"
import YugiohCard from "@/components/cardTemplates/YugiohCard.vue"
import type {CardStore} from "@/types/store"
import type {GameType, GenericCard} from "@/types/card"

/**
 * Props definition.
 *
 * @prop {CardStore} store - The Card store
 */
const props = defineProps<{
    store: CardStore
}>()

const fallbackImage = 'https://placehold.co/150x200?text=No+Image';

const currentCard = computed(() => props.store.currentCard as GenericCard | null)
const gameType = computed(() => props.store.gameType as GameType)
const canAddCard = computed(() => currentCard.value ? props.store.canAddCard(currentCard.value).valid : false)
const canRemoveCard = computed(() => currentCard.value ? props.store.isCardInDeck(currentCard.value.id) : false)

/**
 * Adds the currently selected card to the deck, if it exists.
 */
function addCurrentCard() {
    if (currentCard.value) {
        props.store.addCardToDeck(currentCard.value);
    }
}

/**
 * Removes the currently selected card from the deck, if it exists.
 */
function removeCurrentCard() {
    if (currentCard.value) {
        props.store.removeCardFromDeck(currentCard.value.id);
    }
}

</script>