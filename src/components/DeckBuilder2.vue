<template>
    <div
        class="container m-auto p-4 bg-tan-300 dark:bg-big-stone-700 text-tan-950 dark:text-big-stone-50 rounded select-none">
        <div class="builder grid grid-cols-[1fr_680px_380px] lg:flex-row gap-4 h-[700px]">
            <div class="rounded bg-tan-200 dark:bg-big-stone-500 p-2 shadow-lg">
                <CardDetailViewer :store="store"/>
            </div>
            <div class="rounded bg-tan-200 dark:bg-big-stone-500 shadow-lg">
                <DeckZone :store="store"/>
            </div>
            <div class="rounded bg-tan-200 dark:bg-big-stone-500 p-2 shadow-lg">
                <CardList :store="store"/>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import CardList from '@/components/CardList.vue'
import DeckZone from '@/components/DeckZone.vue'
import CardDetailViewer from '@/components/CardDetailViewer.vue'
import type {CardStore} from '@/types/store'

const props = defineProps<{
    store: CardStore
}>()
</script>

<style scoped>
.builder > div {
    max-height: 800px;
    overflow: auto;
}
</style>