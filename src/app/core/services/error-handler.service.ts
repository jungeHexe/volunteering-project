import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {

  private readonly ERROR_IN_UNKNOWN_FORMAT = 'ERROR_IN_UNKNOWN_FORMAT';
  private readonly NOT_FOUND = 'NOT_FOUND';
  private readonly NOT_AUTHORIZED = 'NOT_AUTHORIZED';

  private readonly MESSAGES: ReadonlyMap<string, string> = new Map<string, string>([
    [this.NOT_FOUND, 'не найдены данные по запрашиваемому идентификатору'],
    [this.ERROR_IN_UNKNOWN_FORMAT, 'произошла неизвестная ошибка'],
    [this.NOT_AUTHORIZED, 'ошибка авторизации'],
  ]);

  constructor(
  ) {
  }

  private static formatMessage(prefix: string, description?: string, id?: string): string {
    let message = prefix;
    if (description) {
      message += `: ${description}`;
    }
    if (id) {
      message += ` (id = '${id}')`;
    }
    return message;
  }

  public handleError(error: HttpErrorResponse, prefix: string, id?: string): Observable<never> {
    const message = this.prepareMessage(error, prefix, id);
    return throwError(message);
  }

  public handleErrorAndNull(error: HttpErrorResponse, prefix: string, id?: string): Observable<any> {
    const message = this.prepareMessage(error, prefix, id);
    console.error(message);
    return of(error);
  }

  private prepareMessage(error: HttpErrorResponse, prefix: string, id?: string): string {
    if (!error) {
      return prefix;
    }

    if (error.error instanceof ErrorEvent) {
      return ErrorHandlerService.formatMessage(prefix, error.error.message, id);
    }

    if (error.status === 403) {
      return ErrorHandlerService.formatMessage(prefix, error.error.detail ?? this.MESSAGES.get(this.NOT_AUTHORIZED), id);
    }

    if (error.status === 404) {
      return ErrorHandlerService.formatMessage(prefix, error.error.detail ?? this.MESSAGES.get(this.NOT_FOUND), id);
    }

    return ErrorHandlerService.formatMessage(prefix, error.error.detail ?? this.MESSAGES.get(this.ERROR_IN_UNKNOWN_FORMAT), id);
  }
}
