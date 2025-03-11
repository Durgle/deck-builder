<script setup lang="ts">
import DeckBuilder from '@/components/DeckBuilder.vue';
import cards from '@/assets/data/cards.json';
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
    </div>
</template>

<style scoped>
</style>
