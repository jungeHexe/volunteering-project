import { AbstractControlOptions, AsyncValidatorFn, FormControl, ValidatorFn, Validators } from '@angular/forms';

export class CustomFormControl extends FormControl {

  public index = 0;

  private validators: ValidatorFn[] = [];

  constructor(
    formState?: any,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
    index?: number,
  ) {
    super(CustomFormControl.prepareFormState(formState), validatorOrOpts, asyncValidator);
    this.saveValidators(validatorOrOpts);
    if (index) {
      this.index = index;
    }
  }

  private static prepareFormState(formState: any = null): any {
    if (formState == null) {
      return null;
    }
    if (formState instanceof Object && formState.value === undefined) {
      formState.value = null;
    }
    return formState;
  }

  isRequired(): boolean {
    return this.validators.includes(Validators.required);
  }

  override setValidators(newValidator: ValidatorFn | ValidatorFn[] | null): void {
    if (!Array.isArray(newValidator)) {
      throw Error('newValidator is not array');
    }
    this.validators = newValidator as ValidatorFn[];
    super.setValidators(newValidator);
  }

  getValidators(): ValidatorFn[] {
    return [...this.validators];
  }

  addValidator(validator: ValidatorFn, index = 0): void {
    const validators = [...this.validators];
    const indexOfValidator = validators.findIndex((v) => v === validator);
    if (indexOfValidator < 0) {
      validators.splice(index, 0, validator);
      this.setValidators(validators);
      if (!this.untouched) {
        this.markAsTouched();
      }
      this.updateValueAndValidity();
    }
  }

  removeValidator(validator: ValidatorFn): void {
    const validators = [...this.validators];
    const indexOfValidator = validators.findIndex((v) => v === validator);
    if (indexOfValidator >= 0) {
      validators.splice(indexOfValidator, 1);
      this.setValidators(validators);
      if (!this.untouched) {
        this.markAsTouched();
      }
      this.updateValueAndValidity();
    }
  }

  removeAllValidators(): void {
    this.validators.forEach(validator => this.removeValidator(validator));
  }

  /**
   * Переопределяем для корректного отображения ошибок в gas-компонентах
   * при использовании updateValueAndValidity({ emitEvent: false });
   * с назначением повторно ошибок контролу и вызовом markAsTouched();
   */
  override updateValueAndValidity(opts?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  }): void {
    // Метод updateValueAndValidity может быть вызван до того, как контрол был отрендерен.
    // this.statusChanges здесь показывает нам был ли отрендерен контрол
    if (this.statusChanges) {
      this.setErrors(this.errors);
      this.markAsTouched();
    }
    super.updateValueAndValidity(opts);
  }

  /**
   * Установить в checkbox значение false и выполнить disable
   */
  setBooleanAndDisable(value = false): void {
    this.setValue(value);
    this.disable();
  }

  private saveValidators(validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null): void {
    if (Array.isArray(validatorOrOpts)) {
      this.validators = validatorOrOpts;
    } else if (validatorOrOpts &&
      (validatorOrOpts as AbstractControlOptions).validators &&
      Array.isArray((validatorOrOpts as AbstractControlOptions).validators)) {
      this.validators = (validatorOrOpts as AbstractControlOptions).validators as ValidatorFn[];
    } else if (validatorOrOpts) {
      throw Error('validatorOrOpts is not array');
    }
  }
}
