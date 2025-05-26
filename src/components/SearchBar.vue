<template>
    <div class="search-bar m-2">
        <div class="flex gap-4">
            <Input v-model="searchQuery" @keyup.enter="search" placeholder="Search for cards..." :clearable="true"
                   @clear="search" class="flex-1"/>
            <button
                @click="search"
                class="px-4 py-2 bg-tan-600 dark:bg-big-stone-700 text-tan-100 dark:text-big-stone-100 rounded-lg hover:bg-tan-500 dark:hover:bg-big-stone-800 cursor-pointer transition-colors"
                :disabled="loading"
            >
                <Search :size="20"/>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import Input from '@/components/Input.vue'
import {Search} from 'lucide-vue-next'
import type {CardStore} from '@/types/store'

/**
 * Props definition.
 *
 * @prop {CardStore} store - The Card store
 */
const props = defineProps<{
    store: CardStore
}>()

const searchQuery = ref('')
const loading = computed(() => props.store.loading)

function search() {
    props.store.searchCards(searchQuery.value)
}
</script>
