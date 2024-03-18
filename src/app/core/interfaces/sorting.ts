export interface Sorting {
  parameter: string;
  sortType: SortType;
}

export enum SortType {
  Asc = 'ASC',
  Desc = 'DESC',
}
