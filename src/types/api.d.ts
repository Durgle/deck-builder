export interface ApiResponse {
    data: any;
    error?: string;
}

export interface CardGameApi {
    searchCards: (query: string) => Promise<ApiResponse>;
    mapCardData: (card: any) => Card;
}