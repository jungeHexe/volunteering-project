import { HttpClient } from "@angular/common/http";
import {Injectable} from "@angular/core";
import {catchError, first, map, Observable} from "rxjs";
import { SERVER_URL } from "src/app/app.constants";
import {TagValue} from "../domain/tag-value.model";
import { ErrorHandlerService } from "./error-handler.service";
import {SelectOption} from "../interfaces/select-option";

@Injectable({ providedIn: 'root' })
export class SelectorService {

  constructor(
    private readonly http: HttpClient,
    private readonly errorHandler: ErrorHandlerService,
  ) {}

  getSkills(): Observable<TagValue[]> {
    return this.http.get(`${SERVER_URL}skills`)
      .pipe(
        first(),
        catchError((err) => this.errorHandler.handleErrorAndNull(err, 'Ошибка при получении списка навыков')),
        map((response: any[]) =>  response?.map(o => TagValue.toClientObject(o))),
      );
  }


  /**
   * Добавить опцию для выбора в массив.
   */
  protected pushOption(options: SelectOption[], enumData: Partial<{ name: string }>, enumValue: any): void {
    options.push({
      guid: enumValue,
      name: enumData.name,
    });
  }
}
