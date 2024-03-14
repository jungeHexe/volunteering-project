export class StringUtils {

  private static readonly repeatingSpacesRegEx = /\s\s+/g;

  /**
   * Преобразовать первую букву строки в uppercase
   * @param value текст
   */
  static capitalizeFirstLetter(value: string): string {
    if (typeof value !== 'string') {
      return null;
    }
    if (value.length === 0) {
      return value;
    }
    return `${value[0].toUpperCase()}${value.substring(1)}`;
  }

  /**
   * Преобразовать сумму в строку для отображения в колонке
   * @param value текст
   */
  static amountToString(value: number): string {
    return Number(value)?.toLocaleString('ru', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  /**
   * Убрать множественные пробелы и пробелы вокруг - и '. Капитализировать слова, кроме особых частей имен
   * @param value обрабатываемая строка
   * @param expectMore ожидается ли дальнейший ввод, в таком случае учитываем при капитализации
   */
  static trimSpacesAndCapitalize(value: string, expectMore = false): string {
    if (typeof value !== 'string') {
      return null;
    }
    const space = ' ';
    return value
      .trimStart()
      .replace(this.repeatingSpacesRegEx, space)
      .replace(' -', '-')
      .replace('- ', '-')
      .replace(' \'', '\'')
      .replace('\' ', '\'')
      .split(space)
      .join(space);
  }

  static containsIgnoreCase(value: string, subString: string): boolean {
    if (!subString) {
      return true;
    }
    if (!value) {
      return false;
    }
    return value.toLowerCase().indexOf(subString.toLowerCase()) !== -1;
  }

  static fromBoolean(value: boolean): string {
    if (value == null) {
      return '';
    }
    return value ? 'Да' : 'Нет';
  }

  static noun(count: number, ...forms: string[]): string {
    // eslint-disable-next-line prefer-rest-params
    const args = Array.prototype.slice.call(arguments, 1);
    let str;
    switch (args.length) {
      case 1:
        throw new Error('Not enough forms');
      case 2:
        str = count > 1 ? forms[1] : forms[0];
        break;
      default:
        str = forms[this.getNounPluralForm(count)];
        break;
    }
    return str.replace(/%d/g, count.toString());
  }

  static ordinal(count: number, form1: string, form2: string): string {
    const lastNumber = count > 9
      ? Number(count.toString().split('').slice(-1))
      : count;
    if (lastNumber === 0) {
      return form2;
    }
    return StringUtils.noun(lastNumber, form1, form2);
  }

  private static getNounPluralForm(count: number): number {
    if (count % 10 === 1 && count % 100 !== 11) {
      return 0;
    } else if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
      return 1;
    } else {
      return 2;
    }
  }

  static extractWords(str: string): string[] {
    const regex = /[a-zA-Zа-яА-Я]+/g;
    return str.match(regex) || [];
  }

  static findWordInString(str: string, wordToFind: string): boolean {
    if (!str || !wordToFind) {
      return false;
    }

    return this.extractWords(str.toLocaleLowerCase()).some(x => x === wordToFind.toLocaleLowerCase());
  }
}
