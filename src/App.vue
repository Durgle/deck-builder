<script setup lang="ts">
import DeckBuilder from '@/components/DeckBuilder.vue';
import {CardGame} from "@/enums/cardGame";
</script>

<template>
    <div class="app">
        <div class="deck-builder-container">
            <DeckBuilder/>
        </div>
        <div class="deck-builder-container-yugioh">
            <DeckBuilder :cardGame="CardGame.YUGIOH"/>
        </div>
    </div>
</template>

<style scoped>
.app {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>
