<script setup lang="ts">
import DeckBuilder from '@/components/DeckBuilder.vue';
import {CardGame} from "@/enums/cardGame";
</script>

<template>
    <div class="app flex flex-col gap-2">
        <div class="deck-builder">
            <DeckBuilder/>
        </div>
        <div class="deck-builder-yugioh">
            <DeckBuilder :cardGame="CardGame.YUGIOH"/>
        </div>
    </div>
</template>

<style scoped>
</style>
