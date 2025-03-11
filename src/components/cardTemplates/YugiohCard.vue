<script setup lang="ts">
import {Shield} from "lucide-vue-next";
import {Sword} from "lucide-vue-next";
import {Star} from "lucide-vue-next";
import {YugiohCard} from "@/types/card";

defineProps({
    card: {
        type: Object as () => YugiohCard,
        required: true,
    },
});

const increment = () => {
    console.log("Ajouté au deck");
};

const decrement = () => {
    console.log("Retiré du deck");
};
</script>

<template>
    <div class="card-container">
        <!-- Nom de la carte -->
        <div class="card-header">
            <h3>{{ card.name }}</h3>
            <span>{{ card.attribute }}</span>
        </div>

        <!-- Image de la carte -->
        <div class="card-image-container">
            <img :src="card.image" class="card-image" alt="card.name"/>
        </div>

        <!-- Infos principales -->
        <div class="card-info">
            <div class="stats">
                <span v-if="card.level"><Star/> {{ card.level }}</span>
                <span v-if="card.attack"><Sword/> {{ card.attack }}</span>
                <span v-if="card.defense"><Shield/> {{ card.defense }}</span>
            </div>
        </div>

        <!-- Effet de la carte -->
        <div class="card-effect">
            <h3>{{ card.type }}</h3>
            <p>{{ card.description }}</p>
        </div>

        <div class="card-actions">
            <button @click="increment" class="btn">+1</button>
            <button @click="decrement" class="btn">-1</button>
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

.card-info {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    margin-bottom: 5px;
}

.stats {
    display: flex;
    gap: 10px;
    width: 100%;
}

.stats span {
    flex: 1;
}

.card-effect {
    background: rgba(255, 255, 255, 0.1);
    padding: 5px;
    border-radius: 4px;
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