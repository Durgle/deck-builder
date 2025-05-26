<template>
    <div
        class="card-item m-auto w-[50px] cursor-pointer"
        :class="{ 'opacity-75': isDragging }"
        draggable="true"
        @dragstart="onDragStart"
        @dragend="onDragEnd"
    >
        <img
            :src="card.imageUrl || fallbackImage"
            :alt="card.name"
            :title="card.name"
            class="object-contain"
            loading="lazy"
        />
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import type {GameType, GenericCard} from '@/types/card'
import {useDragContextStore} from '@/stores/dragContextStore'
import {DragZoneType} from "@/types/drag";

/**
 * Props definition.
 *
 * @prop {GenericCard} card - The card data to display and drag
 * @prop {Exclude<DragZoneType, null>} source - Source zone identifier for drag context
 * @prop {GameType} [gameType] - Game type
 */
const props = defineProps<{
    card: GenericCard
    source: Exclude<DragZoneType, null>
    gameType?: GameType
}>();

const isDragging = ref(false);
const fallbackImage = 'https://placehold.co/150x200?text=No+Image';
const dragSource = useDragContextStore()

const emit = defineEmits(['dragCard']);

/**
 * Emits the 'dragCard' event with the current card as payload
 */
const handleDragCard = () => {
    emit("dragCard", props.card);
};

/**
 * Drag start event handler
 * Sets drag state, updates drag context store and initializes drag data transfer.
 */
function onDragStart(e: DragEvent) {
    isDragging.value = true;
    if (e.dataTransfer) {
        handleDragCard()
        dragSource.setSource(props.source);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', JSON.stringify({
            card: props.card,
            gameType: props.gameType,
        }));
    }
}

/**
 * Drag end event handler.
 * Resets drag state and clears drag context store.
 */
function onDragEnd() {
    isDragging.value = false;
    dragSource.clearDragState()
}
</script>