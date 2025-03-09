<script setup>
import DeckBuilder from '@/components/DeckBuilder.vue';
import cards from '@/assets/data/cards.json'

const deckRules = [
    (card, selected) => selected.length >= 40,
    (card, selected) => selected.filter(item => item.id === card.id).length >= 3
];
</script>

<template>
    <div class="app">
        <div class="deck-builder-container">
            <DeckBuilder
                :items="cards"
                :rules="deckRules"
            />
        </div>
    </div>
</template>

<style scoped>
</style>
