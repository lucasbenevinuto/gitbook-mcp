export interface PaginationParams {
  page?: string;
  limit?: number;
}

export function buildPaginationQuery(params: PaginationParams): URLSearchParams {
  const query = new URLSearchParams();
  if (params.page) {
    query.set("page", params.page);
  }
  if (params.limit !== undefined) {
    query.set("limit", String(params.limit));
  }
  return query;
}

export interface PaginatedResponse<T> {
  items: T[];
  next?: { page: string };
}

export function formatPaginatedResult<T>(
  response: PaginatedResponse<T>,
  label: string
): string {
  const lines: string[] = [];
  lines.push(`${label} (${response.items.length} items):`);
  lines.push(JSON.stringify(response.items, null, 2));
  if (response.next) {
    lines.push(`\nNext page token: ${response.next.page}`);
  }
  return lines.join("\n");
}
