<script setup lang="ts">
import DeckBuilder from '@/components/DeckBuilder.vue';
import cards from '@/assets/data/cards.json';
import yugiohCards from '@/assets/data/yugiohCards.json';
import {deckRules} from "@/utils/deckRules";
</script>

<template>
    <div class="app">
        <div class="deck-builder-container">
            <DeckBuilder
                :items="cards"
                :rules="deckRules"
            />
        </div>
        <div class="deck-builder-container-yugioh">
            <DeckBuilder
                gameType="Yugioh"
                :items="yugiohCards"
                :rules="deckRules"
            />
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
