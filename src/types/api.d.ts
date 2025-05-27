import {GenericCard} from "@/types/card";

export interface ApiResponse {
    data: any;
    error?: string;
    meta?: PaginationMeta;
}

export interface PaginationMeta {
    current_rows: number,
    total_rows: number,
    rows_remaining?: number,
    total_pages?: number,
    pages_remaining?: number,
    next_page: string | null,
    next_page_offset?: number
}

export interface CardGameApi<T extends GenericCard = GenericCard> {
    fetchCards: (query: string) => Promise<ApiResponse>;
    fetchCardsFromUrl?: (url: string) => Promise<ApiResponse>;
    mapCardData: (card: any) => T;
}