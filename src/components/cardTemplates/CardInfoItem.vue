<template>
    <div
        v-if="$slots.value || (value !== null && value !== undefined)"
        :class="[
            'flex gap-2 min-h-10 items-center rounded bg-tan-100 dark:bg-big-stone-400',
            colSpanClass
        ]"
    >
        <div v-if="hideLabel !== true"
             class="w-10 flex justify-center items-center bg-tan-300 dark:bg-big-stone-300 rounded-l h-full">
            <img v-if="icon" :src="icon" :alt="alt" class="w-6"/>
            <div v-else class="text-center font-semibold text-sm select-none">
                <slot name="label">{{ label }}</slot>
            </div>
        </div>
        <div class="m-2">
            <slot name="value">{{ value }}</slot>
        </div>
    </div>
</template>

<script setup lang="ts">

import {computed} from "vue";

/**
 * Props definition.
 *
 * @prop {string | number | null | undefined} value - The value to display
 * @prop {string} [icon] - Optional icon source path
 * @prop {string | number} [colSpan] - Tailwind `col-span`
 * @prop {string} [alt] - Alternate text for the icon
 * @prop {string} [label] - Fallback label text when no icon is provided
 * @prop {boolean} [hideLabel] - Whether to hide the label/icon section
 */
const props = defineProps<{
    value?: string | number | null | undefined
    icon?: string
    colSpan?: string | number
    alt?: string
    label?: string
    hideLabel?: boolean
}>()

const colSpanClass = computed(() => {
    if (props.colSpan === 'full') return 'col-span-full'
    if (typeof props.colSpan === 'number') return `col-span-${props.colSpan}`
    return ''
})
</script>