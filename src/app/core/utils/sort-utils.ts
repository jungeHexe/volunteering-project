import { ObjectUtils } from './object-utils';

export class SortUtils {

  static sortByObjectPropertyName(array: any[], property: string, order: 'asc' | 'desc' = 'asc'): any[] {
    if (!array || !array.length || !property) {
      return array;
    }
    return array.sort((a, b) => SortUtils
      .compareValue(ObjectUtils.getNestedProperty(a, property), ObjectUtils.getNestedProperty(b, property), order));
  }

  static sortByObjectMultiplePropertyNames(array: any[], properties: string[], order: 'asc' | 'desc' = 'asc'): any[] {
    if (!array || !array.length || !properties.length) {
      return array;
    }
    return array.sort((a, b) => {
      let sort = 0;
      for (const property of properties) {
        sort = SortUtils.compareValue(a[property], b[property], order);
        if (sort !== 0) {
          break;
        }
      }
      return sort;
    });
  }

  private static compareValue(propA: any, propB: any, order: 'asc' | 'desc'): number {
    if (propA instanceof Date) {
      propA = propA.getTime();
    }
    if (propB instanceof Date) {
      propB = propB.getTime();
    }
    const multi = order === 'asc' ? 1 : -1;
    if (propB != null && (propA == null || propA > propB)) {
      return 1 * multi;
    }
    if (propA != null && (propB == null || propB > propA)) {
      return -1 * multi;
    }
    return 0;
  }
}
