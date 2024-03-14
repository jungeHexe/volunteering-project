import { PageData } from './page-data';

export interface SearchResult<T> {
  data: PageData<any>;
  mapper: (serverObject: any) => T;
}
