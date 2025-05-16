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
import {DragZoneType, useDragContextStore} from '@/stores/dragContextStore'

const props = defineProps<{
    card: GenericCard
    source: Exclude<DragZoneType, null>
    gameType?: GameType
}>();

const isDragging = ref(false);
const fallbackImage = 'https://placehold.co/150x200?text=No+Image';
const dragSource = useDragContextStore()
const emit = defineEmits(['dragCard']);

const handleDragCard = () => {
    emit("dragCard", props.card);
};

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

function onDragEnd() {
    isDragging.value = false;
    dragSource.clearDragState()
}
</script>