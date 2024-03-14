import { Observable } from 'rxjs';
import {BaseDomain} from "../domain/abstract/base-domain.model";
import { OperationResult } from '../domain/operation-result.model';
import { SearchResult } from '../interfaces/search-result';

export abstract class EntityService<T extends BaseDomain> {
  abstract search(filter: any): Observable<SearchResult<any>>;
  abstract get(id: string): Observable<T>;
  abstract create(entity: T): Observable<OperationResult>;
  abstract update(entity: T): Observable<OperationResult>;
  abstract delete(entities: any[]): Observable<OperationResult>;
}
