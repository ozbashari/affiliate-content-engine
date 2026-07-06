export interface AliExpressScanInput {
  categoryId: string;
  pageNo?: number;
  pageSize?: number;
  extraParams?: Record<string, unknown>;
}

export interface AliExpressScanResponse {
  code: number;
  msg: string;
  respResult?: unknown;
}
