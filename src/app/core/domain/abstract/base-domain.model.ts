import { v4 as uuidV4 } from "uuid";

/**
 * Базовый класс для доменных классов.
 */
export abstract class BaseDomain {
  /**
   * Идентификатор объекта.
   */
  id: string = uuidV4();
  /**
   * Признак существования объекта только на UI.
   */
  localObject = false;

  /**
   * Конвертировать данные, полученные с сервера, в клиентский объект доменной модели.
   * @param _serverObject данные, полученные с сервера.
   */
  static toClientObject(_serverObject: any): BaseDomain {
    return null;
  }

  /**
   * Конвертировать клиентский объект доменной модели в объект, понятный серверу.
   */
  toServerObject(): any {
    return null;
  }

  /**
   * Конвертировать клиентский объект доменной модели в объект инпута, понятный серверу.
   * @param clientObject клиентский объект.
   */
  static toNestedObject(clientObject: BaseDomain): { id: string } {
    if (!clientObject) {
      return null;
    }
    return {
      id: clientObject.id,
    };
  }
}
