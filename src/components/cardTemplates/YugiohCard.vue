<script setup lang="ts">
import {Shield} from "lucide-vue-next";
import {Sword} from "lucide-vue-next";
import {Star} from "lucide-vue-next";
import {YugiohCard} from "@/types/card";

/**
 * The props object for the component.
 */
defineProps({
    card: {
        type: Object as () => YugiohCard,
        required: true,
    },
});
</script>

<template>
    <div class="card-info-container">

        <div class="card-info">
            <div class="stats">
                <span v-if="card.level"><Star/> {{ card.level }}</span>
                <span v-if="card.attack"><Sword/> {{ card.attack }}</span>
                <span v-if="card.defense"><Shield/> {{ card.defense }}</span>
            </div>
        </div>

        <div class="card-effect">
            <h3>{{ card.cardType }}</h3>
            <p>{{ card.description }}</p>
        </div>
    </div>
</template>

<style scoped>
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
</style>