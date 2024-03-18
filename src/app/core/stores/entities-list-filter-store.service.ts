import { BaseListFilter } from "../domain/base-list-filter.model";

export abstract class EntitiesListFilterStoreService<T extends BaseListFilter> {
  abstract set filter(filter: T);
  abstract get filter(): T;
}
