<script setup>
import {defineProps, defineEmits} from "vue";
import {XSquare} from "lucide-vue-next";

const props = defineProps({
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

const updateValue = (event) => {
    emit("update:modelValue", event.target.value);
};

const clearInput = () => {
    emit("update:modelValue", "");
};
</script>

<template>
    <div class="input-container">
        <label v-if="label" class="input-label">{{ label }}</label>
        <div class="input-wrapper">
            <input
                :type="type"
                :placeholder="placeholder"
                :value="modelValue"
                @input="updateValue"
                :class="{'has-clear-button': clearable && modelValue}"
                class="input-field"
            />
            <button v-if="clearable && modelValue" @click="clearInput" class="clear-button">
                <XSquare size="20"/>
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