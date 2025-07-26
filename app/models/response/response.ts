import type { MetaPagination } from "..";

export interface BaseResponse<T> extends MetaPagination {
  data: T[];
}

export const InitBaseResponse = <T>(): BaseResponse<T> => ({
  page: 1,
  total: 0,
  lastPage: 0,
  data: [],
});
