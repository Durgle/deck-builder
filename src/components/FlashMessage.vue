<template>
    <div
        v-show="visible && message"
        :class="[ 'border-l-4 p-4 rounded mb-2 flex justify-between items-start relative select-none transition-opacity duration-300 ease-in-out', typeClass ]"
        role="alert"
        aria-live="assertive"
    >
        <div class="flex-1 pr-4">
            {{ message.content }}
        </div>
        <button @click="close" aria-label="Close"
                class="absolute right-1.5 top-1.5 font-bold leading-none focus:outline-none hover:text-white">
            <CircleX :size="20"/>
        </button>
    </div>
</template>

<script setup lang="ts">
import {FlashMessage} from "@/types/flashMessage";
import {computed, ref, watch} from "vue";
import {CircleX} from "lucide-vue-next";

/**
 * Props definition.
 *
 * @prop {FlashMessage} message - The message
 */
const props = defineProps<{
    message: FlashMessage
}>()

const visible = ref(true)
const typeClass = computed(() => {
    switch (props.message.type) {
        case 'error':
            return 'border-red-600 text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-300'
        case 'warning':
            return 'border-yellow-500 text-yellow-700 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300'
        case 'success':
            return 'border-green-600 text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300'
        case 'info':
        default:
            return 'border-blue-600 text-blue-700 bg-blue-100 dark:bg-blue-900 dark:text-blue-300'
    }
})

watch(
    () => props.message,
    (newMessage) => {
        if (newMessage) {
            visible.value = true
        }
    }
)

function close() {
    visible.value = false
}

</script>
