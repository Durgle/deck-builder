import {defineStore} from 'pinia'

export type DragZoneType = 'card-list' | 'deck' | null

export const useDragContextStore = defineStore('dragContext', {
    state: () => ({
        source: null as DragZoneType,
        hoverZone: null as DragZoneType
    }),

    actions: {
        setSource(source: Exclude<DragZoneType, null>) {
            this.source = source;
        },

        clearSource() {
            this.source = null;
            this.hoverZone = null;
        },

        setHoverZone(zone: Exclude<DragZoneType, null>) {
            this.hoverZone = zone
        },

        clearHoverZone() {
            this.hoverZone = null;
        },

        clearDragState() {
            this.clearSource();
            this.clearHoverZone();
        }
    },

    getters: {
        isHovering: (state) => {
            return (zone: Exclude<DragZoneType, null>) => state.hoverZone === zone;
        },

        isDroppable: (state) => {
            return (zone: Exclude<DragZoneType, null>) => state.source !== null && state.source !== zone;
        },
    }
})