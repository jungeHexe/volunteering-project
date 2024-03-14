import {ObjectUtils} from "../utils/object-utils";
import {BaseDomain} from "./abstract/base-domain.model";

export class TagValue extends BaseDomain {
  /**
   * Название
   */
  title: string = null;

  constructor(entity: Partial<TagValue> = null) {
    super();
    if (!entity) {
      return;
    }
    ObjectUtils.constructorFiller(this, entity);
  }

  static override toClientObject(serverObject: any): TagValue {
    if (!serverObject) {
      return null;
    }
    return new TagValue(serverObject);
  }

  override toServerObject(): any {
    return {
      id: this.id,
      title: this.title,
    };
  }

  override toString(): string {
    return this.title;
  }
}
