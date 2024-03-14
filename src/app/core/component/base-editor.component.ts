import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {EventEmitter, OnDestroy} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, iif } from 'rxjs';
import { tap } from 'rxjs/operators';
import {BaseDomain} from "../domain/abstract/base-domain.model";
import {NavigationService} from "../services/navigation.service";
import { EntityStoreService } from '../stores/entity-store.service';
import { EntityService } from '../services/entity.service';
import {AppConstants, ObjectFormState } from 'src/app/app.constants';
import { FormUtils } from '../utils/form-utils';
import { CustomFormControl } from './custom-form.control';
import {OperationResult, OperationStatusEnum} from "../domain/operation-result.model";
import { ObjectUtils } from '../utils/object-utils';

/**
 * Базовый класс для компонента таблицы с локальными данными
 */
@UntilDestroy()
export class BaseEditorComponent<T extends BaseDomain> implements OnDestroy {
  /**
   * Наименования контролов формы.
   */
  CONTROL_NAMES: any;
  /**
   * Наименование табов формы.
   */
  TABS: any;
  /**
   * Основная FormGroup для редактора.
   */
  readonly formGroup = new FormGroup({});

  /**
   * Признак обработки данных (обычно - сохранение данных).
   */
  readonly isLoading$ = new BehaviorSubject(false);
  /**
   * Признак работы редактора в режиме вложенного.
   */
  readonly isInternalEditor$ = new BehaviorSubject(false);
  /**
   * Признак корректного завершения работы с редактором - по кнопкам сохранить/отменить/стрелке назад.
   */
  readonly isCorrectDeactivation$ = new BehaviorSubject(false);
  /**
   * Признак пропуска окна о необходимости сохранения данных.
   */
  readonly isDirtyCheckSkip$ = new BehaviorSubject(false);
  /**
   * Признак работы редактора в режиме создания.
   */
  readonly isCreateMode$ = new BehaviorSubject(false);
  /**
   * Признак работы редактора в режиме только чтения (все поля и кнопки создания недоступны).
   */
  readonly isReadOnlyMode$ = new BehaviorSubject(false);
  /**
   * Признак вложенности редактора в другой редактор.
   */
  nestedEditor = false;
  /**
   * Событие закрытия текущего вложенного редактора
   */
  readonly closeEditor = new EventEmitter<void>();
  readonly openEditor$ = new BehaviorSubject(false);
  /**
   * Заголовок карточки
   */
  cardTitle: string;
  /**
   * Адрес модуля
   */
  listUrl: string = null;

  constructor(
    protected readonly router: Router,
    protected readonly route: ActivatedRoute,
    protected navigationService: NavigationService,
    private readonly entityService: EntityService<T>,
    private readonly generalEntityStoreService: EntityStoreService<T>,
    private readonly internalEntityStoreService: EntityStoreService<T> = null,
  ) {
    this.isCreateMode$.next(route?.snapshot?.data?.['currentAction'] === ObjectFormState.CREATE);
    this.isReadOnlyMode$.next(route?.snapshot?.data?.['currentAction'] === ObjectFormState.READ);
    this.isInternalEditor$.next((route?.snapshot?.data?.['isInternalEditor'] && !!internalEntityStoreService) ?? false);

    if (this.entityStoreService) {
      this.entityStoreService.savedEntity = null;
      this.entityStoreService.savedResult = null;
    }
  }

  ngOnDestroy(): void {
    if (!this.openEditor$.value) {
      this.entityStoreService.entity = null;
    }
  }

  /**
   * Корректный store для текущего редактора.
   */
  get entityStoreService(): EntityStoreService<T> {
    return this.isInternalEditor$.value
      ? this.internalEntityStoreService
      : this.generalEntityStoreService;
  }

  /**
   * Получить контрол.
   * @param controlName имя контрола.
   * @param formGroupName имя группы форм.
   */
  getControl(controlName: string, formGroupName: string = null): CustomFormControl {
    const parentFormGroup = formGroupName ? FormUtils.getFormGroup(formGroupName, this.formGroup) : this.formGroup;
    return FormUtils.getControl(parentFormGroup, controlName as string);
  }

  /**
   * Получить форму.
   * @param formGroupName имя группы форм.
   */
  getFormGroup(formGroupName: string): FormGroup {
    return FormUtils.getFormGroup(formGroupName, this.formGroup);
  }

  /**
   * Установить открытый таб редактора в store.
   * @param name имя таба.
   */
  setActiveTab(name: string): void {
    this.entityStoreService.activeTab = name;
  }

  /**
   * Проверить, что таб должен быть открыт в текущий момент.
   * @param name имя таба.
   */
  isTabActive(name: string): boolean {
    return this.entityStoreService.activeTab === name;
  }

  /**
   * Доступность кнопки "Сохранить" на форме.
   */
  saveDisabled(): boolean {
    return this.isLoading$.value || !this.isDirty();
  }

  /**
   * Проверить валидность формы и сохранить измененный объект.
   */
  save(createNext = false): void {
    if (this.saveDisabled() || !this.validate()) {
      return;
    }
    this.isLoading$.next(true);
    this.beforeSaveActions(createNext);
  }

  /**
   * Вернуться на предыдущий url с учетом проверки деактивации.
   */
  navigateBack(): void {
    if (this.nestedEditor) {
      this.navigateBackFromNested().then();
      return;
    }
    this.isCorrectDeactivation$.next(true);
    this.navigationService.navigateBack();
  }

  async navigateBackFromNested(): Promise<void> {
    this.closeNestedEditor();
  }

  protected closeNestedEditor(): void {
    this.closeEditor.emit();
  }

  /**
   * Добавить контролы в FormGroup.
   * @param controls контролы в виде объекта { ключ: значение }.
   */
  protected addControls(controls: { [p: string]: CustomFormControl | FormGroup | FormArray }): void {
    FormUtils.addControls(this.formGroup, controls);
  }

  /**
   * Выполнить действия перед сохранением.
   */
  protected beforeSaveActions(createNext = false): void {
    this._save(createNext);
  }

  /**
   * Выполнить действия после сохранения.
   */
  protected afterSaveActions(createNext: boolean = null): void {
    if (!createNext) {
      this.navigateBack();
    } else {
      this.isDirtyCheckSkip$.next(false);
      this.onCreateNext();
    }
  }

  /**
   * Хук для хендлинга нажатия кнопки "Сохранить и создать еще"
   *
   * При перегрузке необходимо вызвать метод очистки стора ({@link clearStore}) супер-класса и прописать повторное заполнение стора
   */
  protected onCreateNext(): void {
    return this.clearStore();
  }

  onEditClick(): void {
    this.openEditor$.next(true);
    this.router.navigate([
      this.listUrl,
      AppConstants.EDIT,
      this.entityStoreService.entity.id,
      ]).then(res => setTimeout(() => this.openEditor$.next(false), 0));
  }

  /**
   * Обнуление состояния для корректного создания новой сущности
   */
  protected clearStore(): void {
    this.entityStoreService.entity = null;
    this.entityStoreService.loadedEntity = null;
    this.formGroup.reset();
    this.formGroup.markAsPristine();
  }

  /**
   * Сохранить измененный объект (на сервер или в store).
   */
  protected _save(createNext = false): void {
    if (this.isInternalEditor$.value) {
      this.isDirtyCheckSkip$.next(true);
      this.entityStoreService.savedEntity = this.entityStoreService.entity;
      this.navigateBack();
    } else {
      this.isLoading$.next(true);
      iif(
        () => this.isCreateMode$.value,
        this.entityService.create(this.entityStoreService.entity),
        this.entityService.update(this.entityStoreService.entity),
      ).pipe(
        untilDestroyed(this),
        tap(() => this.isLoading$.next(false)),
      ).subscribe((result: OperationResult) => {
        this.processSaveResult(result, createNext);
      }, (() => this.isLoading$.next(false)));
    }
  }

  protected processSaveResult(result: OperationResult, createNext = false): void {
    if (result.status === OperationStatusEnum.Ok) {
      this.entityStoreService.savedEntity = this.entityStoreService.entity;
      this.entityStoreService.savedResult = result ?? null;

      /**
       * Нужно для переноса части ранее созданной сущности в новую сущность
       */
      if (!createNext) {
        this.entityStoreService.entity = null;
        this.entityStoreService.loadedEntity = null;
      }

      // this.entityStoreService.directSave$.next(false);
      this.isDirtyCheckSkip$.next(true);
      this.afterSaveActions(createNext);
    } else if (result.status === OperationStatusEnum.Failed) {
      throw new Error('Create error');
    }
  }

  /**
   * Провалидировать форму (с учетом табов).
   */
  protected validate(): boolean {
    const isValid = FormUtils.deepValidateForm(this.formGroup);
    return isValid;
  }

  /**
   * Подготовить сообщение об ошибке при операции создания/обновления.
   * @param _result данные для сообщения (заголовок и содержимое).
   */
  protected prepareMutationErrorMessage(_result: OperationResult): { title?: string; content: string; totalObjects?: number } {
    return {
      content: 'Ошибка при обработке данных',
    };
  }

  /**
   * Проверить наличие несохраненных изменений на форме.
   */
  protected isDirty(): boolean {
    return !ObjectUtils.deepEquals(
      this.entityStoreService.loadedEntity?.toServerObject(),
      this.entityStoreService.entity?.toServerObject());
  }

  trimStringValue(controlName: string, formGroupName: string = null): void {
    const control = this.getControl(controlName, formGroupName);
    const value = control.value;
    if (!value || !(typeof value === 'string')) {
      return;
    }
    control.setValue(value.trim() || null);
  }

  getPathPart(entity: any, store: EntityStoreService<any>): string[] {
    let path: string[];
    if (entity?.id && !entity?.localObject) {
      store.loadedEntity = entity;
      path = [AppConstants.EDIT, entity.id];
    } else {
      store.entity = entity ?? null;
      path = [AppConstants.CREATE];
    }
    return path;
  }

  private _enableReadOnlyMode(abstractControl: AbstractControl): void {
    if (abstractControl instanceof CustomFormControl) {
      abstractControl.disable();
    } else if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
      Object.values(abstractControl.controls)
        .forEach((control) => this._enableReadOnlyMode(control));
    }
  }
}
