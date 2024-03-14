
export interface PageData<T> {
  items: T[];
  total: number;
  pages: number;
  page: number;
  size: number;
}
