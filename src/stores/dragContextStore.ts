import {defineStore} from 'pinia'
import {DragZoneType} from "@/types/drag";

/**
 * Pinia store to manage drag-and-drop context.
 */
export const useDragContextStore = defineStore('dragContext', {
    state: () => ({
        source: null as DragZoneType,
        hoverZone: null as DragZoneType
    }),

    actions: {
        /**
         * Sets the source zone where the drag originated.
         * @param source - The zone where dragging started
         */
        setSource(source: Exclude<DragZoneType, null>) {
            this.source = source;
        },

        /**
         * Clears the source and hover zones.
         */
        clearSource() {
            this.source = null;
            this.hoverZone = null;
        },

        /**
         * Sets the zone currently being hovered.
         * @param zone - The zone currently hovered
         */
        setHoverZone(zone: Exclude<DragZoneType, null>) {
            this.hoverZone = zone
        },

        /**
         * Clears the hover zone.
         */
        clearHoverZone() {
            this.hoverZone = null;
        },

        /**
         * Clears both the source and hover zone states.
         */
        clearDragState() {
            this.clearSource();
            this.clearHoverZone();
        }
    },

    getters: {
        /**
         * Checks if a specific zone is currently being hovered
         *
         * @param state - Store state
         * @returns True if the given zone is being hovered
         */
        isHovering: (state) => {
            return (zone: Exclude<DragZoneType, null>) => state.hoverZone === zone;
        },

        /**
         * Checks if a drop is allowed in a specific zone
         *
         * @param state - Store state
         * @returns True if the source exists and is different from the target zone
         */
        isDroppable: (state) => {
            return (zone: Exclude<DragZoneType, null>) => state.source !== null && state.source !== zone;
        },
    }
})