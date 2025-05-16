<template>
    <div class="dark app min-h-screen bg-tan-100 dark:bg-big-stone-950">
        <div class="container m-auto pt-4">
            <header class="mb-8 text-center">
                <!-- Game selector -->
                <div class="flex justify-center">
                    <button
                        @click="selectedGame = 'yugioh'"
                        class="px-4 py-2 mx-2 rounded-lg"
                        :class="selectedGame === 'yugioh' ? 'dark:bg-big-stone-800 dark:text-big-stone-100 bg-tan-600 text-tan-100' : 'dark:bg-big-stone-300 dark:text-big-stone-900 bg-tan-300 text-tan-950'"
                    >
                        Yu-Gi-Oh!
                    </button>

                    <button
                        @click="selectedGame = 'pokemon'"
                        class="px-4 py-2 mx-2 rounded-lg"
                        :class="selectedGame === 'pokemon' ? 'dark:bg-big-stone-800 dark:text-big-stone-100 bg-tan-600 text-tan-100' : 'dark:bg-big-stone-300 dark:text-big-stone-900 bg-tan-300 text-tan-950'"
                    >
                        Pokémon TCG
                    </button>

                    <button
                        @click="selectedGame = 'base'"
                        class="px-4 py-2 mx-2 rounded-lg"
                        :class="selectedGame === 'base' ? 'dark:bg-big-stone-800 dark:text-big-stone-100 bg-tan-600 text-tan-100' : 'dark:bg-big-stone-300 dark:text-big-stone-900 bg-tan-300 text-tan-950'"
                    >
                        Base
                    </button>
                </div>

            </header>

            <DeckBuilder2 :store="currentStore"/>
        </div>
    </div>
</template>

<script>
import {computed, ref} from 'vue'
import CardList from './components/CardList.vue'
import DeckZone from './components/DeckZone.vue'
import {useYugiohStore} from './stores/yugiohStore.js'
import {usePokemonStore} from './stores/pokemonStore.js'
import {useBaseStore} from "@/stores/baseStore.ts";
import CardDetailViewer from "@/components/CardDetailViewer.vue";
import DeckBuilder2 from "@/components/DeckBuilder.vue";

export default {
    components: {
        DeckBuilder2,
        CardList,
        DeckZone,
        CardDetailViewer
    },

    setup() {
        const selectedGame = ref('yugioh')

        const currentStore = computed(() => {
            if (selectedGame.value === 'yugioh') {
                return useYugiohStore()
            } else if (selectedGame.value === 'pokemon') {
                return usePokemonStore()
            } else {
                return useBaseStore()
            }
        })

        return {
            selectedGame,
            currentStore,
        }
    }
}
</script>