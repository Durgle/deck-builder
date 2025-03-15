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
    <div class="flex flex-col gap-2 space-y-3">
        <div class="flex justify-between text-sm mb-1">
            <div class="flex w-full gap-2">
                <span v-if="card.level" class="flex justify-center p-2 flex-1 items-center gap-1">
                    <Star/> {{ card.level }}
                </span>
                <span v-if="card.attack" class="flex justify-center p-2 flex-1 items-center gap-1">
                    <Sword/> {{ card.attack }}
                </span>
                <span v-if="card.defense" class="flex justify-center p-2 flex-1 items-center gap-1">
                    <Shield/> {{ card.defense }}
                </span>
            </div>
        </div>

        <div class="bg-x-secondary-lighter p-2 rounded-sm">
            <p class="text-lg">{{ card.cardType }}</p>
            <p class="text-sm text-justify">{{ card.description }}</p>
        </div>
    </div>
</template>

<style scoped>
</style>