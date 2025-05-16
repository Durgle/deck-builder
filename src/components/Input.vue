<script setup lang="ts">
import {defineEmits, defineProps} from "vue";
import {XSquare} from "lucide-vue-next";

/**
 * The props object for the component.
 */
defineProps({
    modelValue: String,
    label: String,
    type: {
        type: String,
        default: "text"
    },
    placeholder: String,
    clearable: {type: Boolean, default: false}
});

const emit = defineEmits(["update:modelValue", "clear"]);

/**
 * Handles the event to update the model value.
 *
 * @param {Event} event - The event triggered when the input value changes.
 */
const updateValue = (event: Event) => {
    emit("update:modelValue", (event.target as HTMLInputElement).value);
};

/**
 * Clears the input value.
 */
const clearInput = () => {
    emit("update:modelValue", "");
    emit("clear");
};
</script>

<template>
    <div class="flex flex-col">
        <label v-if="label" class="font-semibold mb-2">{{ label }}</label>
        <div class="relative">
            <input
                :type="type"
                :placeholder="placeholder"
                :value="modelValue"
                @input="updateValue"
                :class="{'pr-10': clearable && modelValue}"
                class="bg-tan-100 dark:bg-big-stone-400 w-full px-3 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tan-700 focus:border-tan-700 dark:focus:ring-big-stone-900 dark:focus:border-big-stone-900"
            />
            <button v-if="clearable && modelValue" @click="clearInput"
                    class="absolute right-2 top-1/2 -translate-y-1/2 hover:text-tan-700 dark:text-big-stone-900 dark:hover:text-big-stone-100 cursor-pointer">
                <XSquare :size="20"/>
            </button>
        </div>
    </div>
</template>