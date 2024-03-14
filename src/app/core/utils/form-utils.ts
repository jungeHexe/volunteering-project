import {FormArray, FormGroup} from '@angular/forms';
import {CustomFormControl} from "../component/custom-form.control";
import { DateUtils } from './date-utils';

/**
 * Класс утилитарных функций для форм.
 */
export class FormUtils {

  /**
   * Добавить контролы в форму.
   * @param formGroup форма.
   * @param controls контролы.
   */
  static addControls(formGroup: FormGroup, controls: {[p: string]: CustomFormControl | FormGroup | FormArray }): void {
    Object.entries(controls).forEach(([key, value]) => {
      formGroup.addControl(key, value);
    });
  }

  /**
   * Получить контрол из группы формы.
   * @param formGroup группа форм.
   * @param controlName имя контрола.
   */
  static getControl(formGroup: FormGroup, controlName: string): CustomFormControl {
    const formControl = formGroup?.controls[controlName] as CustomFormControl;
    return formControl ? formControl : null;
  }

  /**
   * Получить группу форм из другой группы формы.
   * @param groupName имя искомой группы.
   * @param formGroup группа форм.
   */
  static getFormGroup(groupName: string, formGroup: FormGroup): FormGroup {
    const innerFormGroup = formGroup?.controls[groupName] as FormGroup;
    return innerFormGroup ? innerFormGroup : null;
  }

  /**
   * Получить массив форм из другой формы.
   * @param arrayName имя искомого массива форм.
   * @param formGroup группа форм.
   */
  static getFormArray(arrayName: string, formGroup: FormGroup): FormArray {
    const formArray = formGroup?.controls[arrayName] as FormArray;
    return formArray ? formArray : null;
  }

  /**
   * Сбросить значения контролов на форме.
   * @param formGroupName имя формы.
   * @param formGroup группа форм.
   */
  static resetFormGroup(formGroupName: string, formGroup: FormGroup): void {
    const target = FormUtils.getFormGroup(formGroupName, formGroup);
    if (target) {
      Object.values(target.controls)
        .forEach((control) => {
          control.setValue(null);
          control.markAsPristine();
        });
    }
  }

  /**
   * Провалидировать форму и все её вложенные формы и контролы.
   * Фокус смещается в первое невалидное поле (по порядку добавления поля в форму).
   * @param formGroup форма.
   */
  static deepValidateForm(formGroup: FormGroup): boolean {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup) {
        FormUtils.deepValidateForm(control);
      } else if (control instanceof CustomFormControl) {
        control.markAsDirty();
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
    formGroup.updateValueAndValidity({ emitEvent: false });
    // valid будет false для заблокированных контролов, поэтому смотрим !invalid
    return !formGroup.invalid;
  }

  /**
   * Обновить дату в контроле.
   * @param date дата.
   */
  static fixDate(date: Date): any {
    return date ? new Date(date.getTime()) : null;
  }

  /**
   * Установить в контрол "дата по" дату из контрола "дата с".
   * @param dateToControl контрол "дата по".
   * @param dateFromControl контрол "дата с".
   * @param includeTime учитивать ли время при сравнении.
   */
  static updateDateTo(dateToControl: CustomFormControl, dateFromControl: CustomFormControl, includeTime = false): void {
    if (dateFromControl?.value && dateToControl
      && (!dateToControl.value || (includeTime
        ? DateUtils.isDateTimeBeforeOtherDateTime(DateUtils.toDate(dateToControl.value), DateUtils.toDate(dateFromControl.value))
        : DateUtils.isDateBeforeOtherDate(DateUtils.toDate(dateToControl.value), DateUtils.toDate(dateFromControl.value)))
      )) {
      dateToControl.setValue(new Date(dateFromControl.value.getTime()));
    }
  }

  /**
   * Преобразовать значение FormGroup в объект.
   * Если в объекте есть свойство, совпадающее по имени с вложенной FormGroup, то данные будут вложенными (работает 1 уровень вложенности),
   * в остальных случаях данные вложенных FormGroup кладутся в основной объект.
   * @param formGroup форма.
   * @param objectClass конструктор класса.
   * @param previous предыдущий объект (для сохранения значений, которых нет на форме).
   */
  static mapFormToObject<T>(formGroup: FormGroup, objectClass: new (obj?: T) => T, previous: T = null): T {
    const newObject = new objectClass();

    // Заполняем новый объект значениями из формы
    const formValue = this.mapFormGroupToFormValue(formGroup, newObject);
    Object.entries(formValue)
      .filter(([key, _]) => Object.prototype.hasOwnProperty.call(newObject, key))
      .forEach(([key, value]) => (newObject as any)[key] = value);

    // Заполняем новый объект значениями из старого, которых нет на форме или контрол не валиден
    // При этом мы смотрим только ключи объектов
    this.restoreProperties(formGroup, previous, newObject);

    return newObject;
  }

  /**
   * Преобразовать значения контролов формы в объект.
   * @param formGroup форма.
   * @param newObject собираемый объект.
   */
  private static mapFormGroupToFormValue(formGroup: FormGroup, newObject: any): any {
    const formValue: any = {};
    Object.entries(formGroup.controls)
      .forEach(([key, control]) => {
        // Обновляем значением из валидного или очищенного контрола CustomFormControl
        if (control instanceof CustomFormControl && (!control.invalid || !control.value)) {
          formValue[key] = FormUtils.prepareValue(control.value);
        }
        if (control instanceof FormGroup) {
          // Значение FormGroup добавляем или на уровень ниже или на тот же по флагу ignoreFormGroup
          const internalObject = newObject && Object.prototype.hasOwnProperty.call(newObject, key);
          const formGroupValue = this.mapFormGroupToFormValue(control, null);
          if (internalObject) {
            formValue[key] = formGroupValue;
          } else {
            Object.entries(formGroupValue).forEach(([innerKey, value]) => formValue[innerKey] = value);
          }
        }
      });
    return formValue;
  }

  /**
   * Восстановить значения, которых нет на форме.
   * @param formGroup форма.
   * @param previous предыдущий объект (для сохранения значений, которых нет на форме).
   * @param newObject собираемый объект.
   */
  private static restoreProperties(formGroup: FormGroup, previous: any, newObject: any): void {
    if (!previous) {
      return;
    }
    // По ключам предыдущего объекта
    Object.entries(previous)
      .forEach(([key, value]) => {
        const control = formGroup.get(key);
        // Сначала ключ объекта ищем как вложенную FormGroup
        if (control instanceof FormGroup && (value instanceof Object)) {
          this.restoreProperties(control, value, newObject[key]);
        } else {
          const deepControl = this.getDeepControl(formGroup, key);
          // valid будет false для заблокированных контролов, поэтому смотрим !invalid
          if (!deepControl || (deepControl.invalid && deepControl.value)) {
            if (!newObject[key]) {
              newObject[key] = {};
            }
            newObject[key] = value;
          }
        }
      });
  }

  /**
   * Получить контрол из формы с поиском во вложенных подгруппах.
   * @param formGroup группа форм.
   * @param controlName имя контрола.
   */
  private static getDeepControl(formGroup: FormGroup, controlName: string): CustomFormControl {
    let result = FormUtils.getControl(formGroup, controlName);
    if (result) {
      return result;
    }
    for (const name in formGroup.controls) {
      if (Object.prototype.hasOwnProperty.call(formGroup.controls, name)) {
        const control = formGroup.controls[name];
        if (control instanceof FormGroup) {
          result = this.getDeepControl(control, controlName);
          if (result) {
            return result;
          }
        }
      }
    }
    return null;
  }

  /**
   * Обработать единичное значение контрола формы.
   * для строк выполняется trim.
   * @param value значение контрола.
   */
  private static prepareValue(value: any): any {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed === '' ? null : trimmed;
    }
    if (value instanceof Object) {
      // Обработка выбора из autocomplete
      // С учетом допущения, что value и title у нас только в опциях autocomplete
      if (value?.value && value?.title) {
        const selectedAutocompleteOption = {
          id: value.value,
          name: value.title,
          ...value,
        };
        delete selectedAutocompleteOption.value;
        delete selectedAutocompleteOption.title;
        return selectedAutocompleteOption;
      }
    }
    return value;
  }
}
