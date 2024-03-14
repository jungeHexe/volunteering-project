import { BehaviorSubject } from 'rxjs';
import { BaseDomain } from '../domain/abstract/base-domain.model';
import {OperationResult} from "../domain/operation-result.model";
import { ObjectUtils } from '../utils/object-utils';

export class EntityStoreService<T extends BaseDomain> {

  private readonly innerLoadedEntity = new BehaviorSubject<T>(null);
  private readonly innerEntity = new BehaviorSubject<T>(null);
  private readonly innerSavedEntity = new BehaviorSubject<T>(null);
  private readonly innerSavedResult = new BehaviorSubject<OperationResult>(null);

  private readonly innerActiveTab = new BehaviorSubject<string>(null);
  private readonly innerWasActivatedTabs: string[] = [];

  /**
   * Состояние страницы в редакторе.
   */
  public readonly pageState$ = new BehaviorSubject<any>(null);

  /**
   * Загруженный с сервера объект.
   */
  set loadedEntity(entity: T) {
    this.innerLoadedEntity.next(entity);
  }
  get loadedEntity(): T {
    return this.innerLoadedEntity.value;
  }

  /**
   * Объект, с которым работает UI.
   */
  set entity(entity: T) {
    this.innerEntity.next(entity);
  }
  get entity(): T {
    return this.innerEntity.value;
  }

  /**
   * Сохраненный объект.
   */
  set savedEntity(entity: T) {
    this.innerSavedEntity.next(entity);
  }
  get savedEntity(): T {
    return this.innerSavedEntity.value;
  }

  /**
   * Данные, полученные при сохранении объекта.
   */
  set savedResult(data: OperationResult) {
    this.innerSavedResult.next(data);
  }
  get savedResult(): OperationResult {
    return this.innerSavedResult.value;
  }

  /**
   * Активная вкладка редактора.
   */
  set activeTab(id: string) {
    if (!this.innerWasActivatedTabs.includes(id)) {
      this.innerWasActivatedTabs.push(id);
    }
    this.innerActiveTab.next(id);
  }
  get activeTab(): string {
    return this.innerActiveTab.value;
  }

  /**
   * Тип сущности.
   */
  public get entityType(): any {
    return null;
  }

  /**
   * Добавление сохраненной сущности в объект (после нажатия кнопки сохранить).
   */
  public saveInternalEntity(entity: any, target: string): void {
    if (this.savedEntity) {
      entity[target] = this.savedEntity;
      this.entity = null;
      this.loadedEntity = null;
      this.savedEntity = null;
    }
  }

  /**
   * Добавление сохраненной сущности в массив (после нажатия кнопки сохранить).
   * @param array массив.
   * @param changedArray массив для отдельного хранения измененных объектов.
   * @return true для добавленного элемента, false для редактированного.
   */
  public saveInternalEntityInArray(array: T[], changedArray: T[] = null): boolean {
    if (this.savedEntity) {
      const index = ObjectUtils.addToArray(array, this.savedEntity);
      if (changedArray) {
        ObjectUtils.addToArray(changedArray, this.savedEntity);
      }
      this.entity = null;
      this.loadedEntity = null;
      this.savedEntity = null;
      return index === -1;
    }
    return null;
  }
}
