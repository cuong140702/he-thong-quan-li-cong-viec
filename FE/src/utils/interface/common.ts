export interface IQueryBase {
  page: number;
  limit: number;
}

export interface IListDataResponse<T> {
  data: T;
  limit: number;
  page: number;
  totalItems: number;
  totalPages: number;
}
