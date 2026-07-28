export interface PaginationResponse {
  CurrentPage: number;
  Limit: number;
  TotalPages: number;
  TotalItems: number;
}

export interface PaginationConfig {
  page?: number;
  limit?: number;
  enableNewPagination?: boolean;
  name?: string;
  tags?: string;
  isInactive?: boolean;
  isPriority?: boolean;
}

export interface ReorderAssets {
  ViewId: string;
  AppId: string;
  Assets: { Id: string; Order: number }[];
}
