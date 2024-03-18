import {ObjectUtils} from "../utils/object-utils";
import {BaseDomain} from "./abstract/base-domain.model";
import {TagValue} from "./tag-value.model";

export class UserControlNames {
  static readonly AVATAR: keyof User = 'avatar';
  static readonly MISIS_ID: keyof User = 'misisId';
  static readonly EMAIL: keyof User = 'email';
  static readonly FIRST_NAME: keyof User = 'firstName';
  static readonly LAST_NAME: keyof User = 'lastName';
  static readonly MIDDLE_NAME: keyof User = 'middleName';
  static readonly ABOUT: keyof User = 'about';
  static readonly IS_MODERATOR: keyof User = 'isModerator';
  static readonly IS_STAFF: keyof User = 'isStaff';
  static readonly SKILLS: keyof User = 'skills';
}
export class User extends BaseDomain {
  /**
   * Аватар
   */
  avatar: string = null;
  /**
   * ID студента университета
   */
  misisId: string = null;
  /**
   * Электронная почта
   */
  email: string = null;
  /**
   * Имя
   */
  firstName: string = null;
  /**
   * Фамилия
   */
  lastName:	string = null;
  /**
   * Отчество
   */
  middleName:	string = null;
  /**
   * Описание профиля
   */
  about: string = null;
  /**
   * Пользователь является модератором
   */
  isModerator: boolean = null;
  /**
   * Суперпользователь
   */
  isStaff: boolean = null;
  /**
   * Навыки
   */
  skills: TagValue[] = [];

  constructor(entity: Partial<User> = null) {
    super();
    if (!entity) {
      return;
    }
    ObjectUtils.constructorFiller(this, entity);
    this.skills = entity.skills?.map(o => TagValue.toClientObject(o));
  }

  static override toClientObject(serverObject: any): User {
    if (!serverObject) {
      return null;
    }
    return new User(serverObject);
  }

  override toServerObject(): any {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      middleName: this.middleName,
      about: this.about,
      skills: this.skills?.map(o => o.toServerObject()),
    };
  }
}
