import {useDragContextStore} from '@/stores/dragContextStore'
import {ref} from "vue";
import {DragPayload, DragZoneType, DropHandler} from "@/types/drag";

/**
 * Composable to handle drag-and-drop behavior for a specific zone
 *
 * @param zoneName - The identifier for the drop zone
 * @param onDropHandler - Callback invoked when a valid drop occurs
 */
export function useDropZone(zoneName: Exclude<DragZoneType, null>, onDropHandler: DropHandler) {

    const dragCounter = ref(0);
    const dragContext = useDragContextStore();

    /**
     * Triggered when a draggable item enters the zone
     * Sets the current zone as the hover zone if it's the first entry
     */
    function onDragEnter() {
        if (dragCounter.value === 0) {
            dragContext.setHoverZone(zoneName);
        }
        dragCounter.value++;
    }

    /**
     * Triggered when a draggable item leaves the zone
     * Clears the hover zone if no more items are inside
     */
    function onDragLeave() {
        dragCounter.value--;
        if (dragCounter.value <= 0) {
            dragCounter.value = 0;
            dragContext.clearHoverZone();
        }
    }

    /**
     * Triggered when an item is dropped into the zone
     * Parses the payload and delegates it to the provided handler if the drop is valid
     *
     * @param event - The drag event object
     * @param zoneId - (Optional) Sub-zone ID within the main drop zone
     */
    function onDrop(event: DragEvent, zoneId?: string) {
        dragCounter.value = 0;

        try {
            if (!event.dataTransfer) return;

            const rawData = event.dataTransfer.getData('text/plain');
            if (!rawData) return;

            const data: DragPayload = JSON.parse(rawData);

            if (!dragContext.isDroppable(zoneName)) return;

            onDropHandler(data, event, zoneId);
        } catch (error) {
            console.error('Error handling drop:', error);
        } finally {
            dragContext.clearSource();
            dragContext.clearHoverZone();
        }
    }

    return {
        isHovering: () => dragContext.isHovering(zoneName),
        isDroppable: () => dragContext.isDroppable(zoneName),
        onDragEnter,
        onDragLeave,
        onDrop
    }
}