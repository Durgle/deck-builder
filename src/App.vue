<script setup lang="ts">
import DeckBuilder from '@/components/DeckBuilder.vue';
</script>

<template>
    <div class="app">
        <div class="deck-builder-container">
            <DeckBuilder />
        </div>
        <div class="deck-builder-container-yugioh">
            <DeckBuilder cardGame="Yugioh" />
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
