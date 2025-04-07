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
    <div
        class="flex flex-col p-2 gap-2 h-full overflow-auto scrollbar scrollbar-thumb-x-primary scrollbar-track-x-secondary scrollbar-thin">

        <div>
            <h3 class="text-lg font-semibold text-center">{{ card.name }}</h3>
        </div>

        <div>
            <img :src="card.image" class="rounded-lg w-auto h-auto max-h-90 m-auto" alt="card.name"/>
        </div>

        <div v-if="cardGame">
            <YugiohCard v-if="cardGame === CardGame.YUGIOH" :card="card"/>
        </div>

        <div class="flex justify-center gap-4 mt-auto">
            <button @click="handleAddCard"
                    class="cursor-pointer w-12 bg-x-green text-white p-2 rounded-sm text-sm font-semibold hover:bg-x-green-darker">
                +1
            </button>
            <button @click="handleRemoveCard"
                    class="cursor-pointer w-12 bg-x-red text-white p-2 rounded-sm text-sm font-semibold hover:bg-x-red-darker">
                -1
            </button>
        </div>
    </div>
</template>

<style scoped>
</style>