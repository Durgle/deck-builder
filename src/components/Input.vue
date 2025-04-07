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

const emit = defineEmits(["update:modelValue"]);

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
};
</script>

<template>
    <div class="flex flex-col mb-2">
        <label v-if="label" class="font-semibold mb-1">{{ label }}</label>
        <div class="relative">
            <input
                :type="type"
                :placeholder="placeholder"
                :value="modelValue"
                @input="updateValue"
                :class="{'pr-9': clearable && modelValue}"
                class="bg-x-input w-full px-3 py-2 rounded-sm"
            />
            <button v-if="clearable && modelValue" @click="clearInput"
                    class="absolute right-2 top-1/2 -translate-y-1/2 hover:text-x-font-darker">
                <XSquare :size="20"/>
            </button>
        </div>
    </div>
</template>

<style scoped>
.input-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 12px;
}

.input-label {
    font-weight: bold;
    margin-bottom: 4px;
}

.input-wrapper {
    display: flex;
    align-items: center;
    position: relative;
}

.input-field {
    flex: 1;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    padding: 5px;
}

.input-field.has-clear-button {
    padding-right: 40px;
}

.clear-button {
    position: absolute;
    right: 5px;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 14px;
    color: #888;
    display: flex;
    align-items: center;
    justify-content: center;
}

.clear-button:hover {
    color: #333;
}
</style>