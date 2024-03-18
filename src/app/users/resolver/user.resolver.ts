import {Injectable} from "@angular/core";
import {User} from "../../core/domain/user.model";
import {EntityEditorResolver} from "../../core/resolvers/entity-editor-resolver.service";
import {UsersService} from "../service/users.service";
import {UserEditorStoreService} from "../store/user-editor-store.service";

@Injectable({ providedIn: 'root' })
export class UserResolver extends EntityEditorResolver<User> {
  constructor(
    entitiesService: UsersService,
    entityStoreService: UserEditorStoreService,
  ) {
    super(entitiesService, entityStoreService);
  }
}
