import { formatDate } from '@angular/common';

export class DateUtils {

  /**
   * Проверка что год високосный
   */
  public static isLeapYear(year: number): boolean {
    const date = new Date(year, 2, 0);
    return date.getDate() === 29;
  }
  /**
   * Проверка двух дат на равенство (без учета времени)
   */
  static areDatesEqual(date1: Date, date2: Date): boolean {
    if (!date1 || !date2) {
      return false;
    }
    const time1 = this.resetTime(date1).getTime();
    const time2 = this.resetTime(date2).getTime();
    return time1 === time2;
  }

  /**
   * Получение даты в виде строки 'yyyy-MM-ddTHH:mm:ssZ' для текущей тайм зоны
   */
  public static formatToDateTime(value: Date): string {
    if (!value || !DateUtils.isDate(value)) {
      return null;
    }
    return value.toISOString();
  }

  /**
   * Извлечение только даты в формате yyyy-MM-dd для текущей тайм зоны
   */
  public static formatToDateOnly(value: Date): string {
    if (!DateUtils.isDate(value)) {
      return null;
    }
    const fullYearString: string = value.getFullYear().toString().padStart(4, '0');
    const month = value.getMonth() + 1;
    const monthString = month >= 10 ? month : `0${month}`;
    const date = value.getDate();
    const dateString = date >= 10 ? date : `0${date}`;
    return `${fullYearString}-${monthString}-${dateString}`;
  }

  /**
   * Приведение даты в формат dd.MM
   */
  public static formatToDayMonthOnly(value: Date): string {
    if (!DateUtils.isDate(value)) {
      return null;
    }
    return formatDate(value, 'dd.MM', 'ru-RU');
  }

  /**
   * Приведение только даты в 'ru-RU' (dd.MM.yyyy)
   */
  public static formatToRussianDateOnly(value: Date): string {
    if (!DateUtils.isDate(value)) {
      return null;
    }
    return value.toLocaleDateString('ru-RU');
  }

  /**
   * Приведение только времени в 'ru-RU' (HH:mm:ss)
   */
  public static formatToRussianTimeOnly(value: Date): string {
    if (!DateUtils.isDate(value)) {
      return null;
    }
    return value.toLocaleTimeString('ru-RU');
  }

  /**
   * Приведение даты и времени к формату dd.MM.yyyy HH:mm:ss
   */
  public static formatToRussianDateTime(value: Date): string {
    if (!DateUtils.isDate(value)) {
      return null;
    }
    return `${this.formatToRussianDateOnly(value)} ${this.formatToRussianTimeOnly(value)}`;
  }

  /**
   * Проверка является ли значение типом Date
   */
  public static isDate(value: any): value is Date {
    return value instanceof Date && !isNaN(value.valueOf());
  }

  /**
   * Преобразование в Date
   */
  static toDate(value: Date | string): Date {
    if (DateUtils.isDate(value)) {
      return value;
    }
    if (typeof value === 'string') {
      const newDate = new Date(value);
      // если пришла только дата, то устанавливаем время 00:00:00 для текущей тайм зоны
      if (!value.includes('T')) {
        newDate.setHours(0);
      }
      if (DateUtils.isDate(newDate)) {
        return newDate;
      }
    }
    return null;
  }

  static isDateAfterOrEqualsOtherDate(date: Date, otherDate: Date): boolean {
    return !this.isDateBeforeOtherDate(date, otherDate);
  }

  static isDateBeforeOrEqualsOtherDate(date: Date, otherDate: Date): boolean {
    return !this.isDateAfterOtherDate(date, otherDate);
  }

  static isDateTimeAfterOrEqualsOtherDateTime(date: Date, otherDate: Date): boolean {
    return !this.isDateTimeBeforeOtherDateTime(date, otherDate);
  }

  static isDateTimeBeforeOrEqualsOtherDateTime(date: Date, otherDate: Date): boolean {
    return !this.isDateTimeAfterOtherDateTime(date, otherDate);
  }

  static isDateAfterOtherDate(date: Date, otherDate: Date): boolean {
    return this.resetTime(date) > this.resetTime(otherDate);
  }

  static isDateBeforeOtherDate(date: Date, otherDate: Date): boolean {
    return this.resetTime(date) < this.resetTime(otherDate);
  }

  static isDateTimeAfterOtherDateTime(date: Date, otherDate: Date): boolean {
    return date > otherDate;
  }

  static isDateTimeBeforeOtherDateTime(date: Date, otherDate: Date): boolean {
    return date < otherDate;
  }
  private static resetTime(date: Date): Date {
    const reallyDate = this.toDate(date);
    if (reallyDate) {
      reallyDate.setHours(0, 0, 0, 0);
    }
    return reallyDate;
  }

  static yearsToString(year: number): string {
    let count = year % 100;
    if (count >= 5 && count <= 20) {
      return 'лет';
    } else {
      count = count % 10;
      if (count === 1) {
        return 'год';
      } else if (count >= 2 && count <= 4) {
        return 'года';
      } else {
        return 'лет';
      }
    }
  }

}
