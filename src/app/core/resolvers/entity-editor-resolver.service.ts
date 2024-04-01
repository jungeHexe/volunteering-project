import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BaseDomain } from '../domain/abstract/base-domain.model';
import { EntityService } from '../services/entity.service';
import {NavigationService} from "../services/navigation.service";
import { EntityStoreService } from '../stores/entity-store.service';

export class EntityEditorResolver<T extends BaseDomain> implements Resolve<T> {

  constructor(
    protected readonly entityService: EntityService<T>,
    protected readonly entityStoreService: EntityStoreService<T>,
    protected readonly navigationService: NavigationService,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<T> | Promise<T> | T {
    const id = route.paramMap.get('id');
    const local = route.queryParamMap.get('local');
    // При открытии отображаем дефолтное состояние редактора
    this.entityStoreService.pageState$.next(null);
    // Если передан идентификатор объекта
    if (id) {
      // Загружаем объект, если данных нет
      if (this.entityStoreService.loadedEntity?.id !== id && !local) {
        return this.entityService.get(id)
          .pipe(
            catchError(() => {
              this.navigationService.navigateBack();
              return EMPTY;
            }),
            tap((entity: T) => {
              this.entityStoreService.loadedEntity = entity;
            }),
          );
      }
    } else {
      // Если в редакторе ещё не работали - сбрасываем активную вкладку/шаг степпера
      this.entityStoreService.loadedEntity = null;
    }
    return this.entityStoreService.loadedEntity;
  }
}
