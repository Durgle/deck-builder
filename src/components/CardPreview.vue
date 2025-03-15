<script setup lang="ts">
import {Card} from "@/types/card";
import YugiohCard from "@/components/cardTemplates/YugiohCard.vue";
import {CardGame} from "@/enums/cardGame";

/**
 * The props object for the component.
 */
const props = defineProps({
    card: {
        type: Object as () => Card,
        required: true,
    },
    cardGame: {
        type: String,
        default: null
    }
});

const emit = defineEmits(['addCard', 'removeCard']);

/**
 * Handles the addition of a card.
 */
const handleAddCard = () => {
    emit("addCard", props.card.id);
};

/**
 * Handles the removal of a card.
 */
const handleRemoveCard = () => {
    emit("removeCard", props.card.id);
};

</script>

<template>
    <div class="flex flex-col bg-gray-900 text-white p-4 rounded-md gap-2">

        <div>
            <h3 class="text-lg font-semibold">{{ card.name }}</h3>
        </div>

        <div>
            <img :src="card.image" class="w-full rounded-lg" alt="card.name"/>
        </div>

        <div>
            <YugiohCard v-if="cardGame === CardGame.YUGIOH" :card="card"/>
        </div>

        <div class="flex justify-center gap-4">
            <button @click="handleAddCard"
                    class="w-12 bg-gray-600 p-2 rounded-sm text-sm font-semibold hover:bg-gray-500">+1
            </button>
            <button @click="handleRemoveCard"
                    class="w-12 bg-gray-600 p-2 rounded-sm text-sm font-semibold hover:bg-gray-500">-1
            </button>
        </div>
    </div>
</template>

<style scoped>
</style>