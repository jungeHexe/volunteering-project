import {Inject, Injectable} from "@angular/core";
import {TuiAlertService} from "@taiga-ui/core";
import {tap} from "rxjs/operators";
import {User} from "../../core/domain/user.model";
import {catchError, map, Observable} from "rxjs";
import {OperationResult, OperationStatusEnum} from "../../core/domain/operation-result.model";
import {SERVER_URL} from "../../app.constants";
import {HttpClient} from "@angular/common/http";
import {EntityService} from "../../core/services/entity.service";
import {ErrorHandlerService} from "../../core/services/error-handler.service";
import { SearchResult } from "src/app/core/interfaces/search-result";

@Injectable({providedIn: 'root'})
export class UsersService extends EntityService<User> {

  constructor(
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    private readonly http: HttpClient,
    private readonly errorHandler: ErrorHandlerService,
  ) {
    super();
  }

  update(entity: User): Observable<OperationResult> {
    return this.http.patch(`${SERVER_URL}users/${entity.id}`, entity.toServerObject())
      .pipe(
        catchError((err) => this.errorHandler.handleErrorAndNull(err, 'Ошибка при обновлении профиля')),
        map((response: any) => {
          if (response.error) {
            return OperationResult.toClientObject({status: OperationStatusEnum.Failed, ...response});
          }
          return OperationResult.toClientObject({status: OperationStatusEnum.Ok});
        }),
        tap(() =>
          this.alerts.open('Данные пользователя обновлены').subscribe())
      );
  }

  get(id: string): Observable<User> {
    return this.http.get(`${SERVER_URL}users/${id}`)
      .pipe(
        catchError((err) => this.errorHandler.handleErrorAndNull(err, 'Ошибка при получении данных пользователя')),
        map((response: any) => User.toClientObject(response)),
      );
  }

  search(filter: any): Observable<SearchResult<any>> {
    throw new Error("Method not implemented.");
  }
  create(entity: User): Observable<OperationResult> {
    return undefined;
  }
  delete(entities: any[]): Observable<OperationResult> {
    return undefined;
  }

}
