export type PaginationResultType<T> = {
  data: T[];
  hasNextPage: boolean;
  currentPage: number;
  totalRecord: number;
};
