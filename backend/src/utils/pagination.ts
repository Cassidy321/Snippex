export interface PaginationParams {
  limit: number;
  page: number;
}

export interface PaginationResult {
  current: number;
  total: number;
  limit: number;
  count: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export const paginate = (
  params: PaginationParams & { totalItems: number; count: number }
): PaginationResult => {
  const { page, limit, totalItems, count } = params;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    current: page,
    total: totalPages,
    limit,
    count,
    totalItems,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

export const getSkip = (page: number, limit: number): number => {
  return (page - 1) * limit;
};
