import { ObjectUtils } from "../utils/object-utils";

/**
 * Универсальный класс для обработки результата операции на сервере.
 */
export class OperationResult {
  /**
   * Статус операции.
   */
  status: OperationStatusEnum = null;
  /**
   * Идентификатор сущности.
   */
  entityId: string = null;
  /**
   * Ошибки при выполнении операции.
   */
  errors: string[] = [];

  constructor(operationResult: Partial<OperationResult> = null) {
    if (!operationResult) {
      return;
    }
    // Обычные поля
    ObjectUtils.constructorFiller(this, operationResult);
  }

  static toClientObject<T>(serverObject: any): OperationResult {
    if (!serverObject) {
      return null;
    }
    return new OperationResult(serverObject);
  }
}

export enum OperationStatusEnum {
  Ok = 'Ok',
  Failed = 'Failed',
}
