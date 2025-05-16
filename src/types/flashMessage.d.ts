export type FlashMessageType = 'error' | 'success' | 'warning' | 'info';

export interface FlashMessage {
    content: string | null,
    timestamp: number,
    type?: FlashMessageType
}