<template>
    <div
        v-if="visible && message"
        :class="[
      'flash-message border-l-4 p-4 rounded mb-2 flex justify-between items-start relative',
      typeClass
    ]"
        role="alert"
    >
        <div class="flex-1 pr-4">
            {{ message.content }}
        </div>
        <CircleX
            @click="close"
            aria-label="Close"
            :size="20"
            class="absolute right-1.5 top-1.5 font-bold leading-none focus:outline-none cursor-pointer hover:text-white"
        />
    </div>
</template>

<script setup lang="ts">
import {FlashMessage} from "@/types/flashMessage";
import {computed, ref, watch} from "vue";
import {CircleX} from "lucide-vue-next";

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

<style scoped>
.flash-message {
    transition: opacity 0.3s ease;
    user-select: none;
}

button {
    cursor: pointer;
    background: transparent;
    border: none;
    color: inherit;
    line-height: 1;
}

button:hover {
    color: #000000;
}
</style>
