<script setup lang="ts">
import {Card} from "@/types/card";
import YugiohCard from "@/components/cardTemplates/YugiohCard.vue";

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
const handleAddCard = (event: Event) => {
    emit("addCard", props.card);
};

const handleRemoveCard = (event: Event) => {
    emit("removeCard", props.card);
};

</script>

<template>
    <div class="card-container">

        <div class="card-header">
            <h3>{{ card.name }}</h3>
        </div>

        <div class="card-image-container">
            <img :src="card.image" class="card-image" alt="card.name"/>
        </div>

        <div class="card-data">
            <YugiohCard v-if="cardGame === 'Yugioh'" :card="card"/>
        </div>

        <div class="card-actions">
            <button @click="handleAddCard" class="btn">+1</button>
            <button @click="handleRemoveCard" class="btn">-1</button>
        </div>
    </div>
</template>

<style scoped>
.card-container {
    margin: 0 auto;
    width: 300px;
    background: #1e1e1e;
    color: white;
    padding: 10px;
    border-radius: 8px;
    text-align: center;
    font-family: Arial, sans-serif;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-image-container {
    margin: 10px 0;
}

.card-image {
    width: 100%;
    border-radius: 8px;
}

.stats span {
    flex: 1;
}

.card-actions {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin: 10px 0;
}

.btn {
    background: gray;
    padding: 5px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}
</style>