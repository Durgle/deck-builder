import {DragZoneType, useDragContextStore} from '@/stores/dragContextStore'
import {ref} from "vue";
import {DragPayload, DropHandler} from "@/types/drag";

export function useDropZone(zoneName: Exclude<DragZoneType, null>, onDropHandler: DropHandler) {

    const dragCounter = ref(0)
    const dragSource = useDragContextStore()

    function onDragEnter() {
        if (dragCounter.value === 0) {
            dragSource.setHoverZone(zoneName);
        }
        dragCounter.value++;
    }

    function onDragLeave() {
        dragCounter.value--;
        if (dragCounter.value <= 0) {
            dragCounter.value = 0;
            dragSource.clearHoverZone();
        }
    }

    function onDrop(event: DragEvent, zoneId?: string) {
        dragCounter.value = 0

        try {
            if (!event.dataTransfer) return

            const raw = event.dataTransfer.getData('text/plain')
            if (!raw) return

            const data: DragPayload = JSON.parse(raw)

            if (!dragSource.isDroppable(zoneName)) return

            onDropHandler(data, event, zoneId)
        } catch (error) {
            console.error('Error handling drop:', error)
        } finally {
            dragSource.clearSource()
            dragSource.clearHoverZone()
        }
    }

    return {
        isHovering: () => dragSource.isHovering(zoneName),
        isDroppable: () => dragSource.isDroppable(zoneName),
        onDragEnter,
        onDragLeave,
        onDrop
    }
}