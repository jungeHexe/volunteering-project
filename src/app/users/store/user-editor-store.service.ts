import {Injectable} from "@angular/core";
import {User} from "../../core/domain/user.model";
import {EntityStoreService} from "../../core/stores/entity-store.service";

@Injectable({ providedIn: 'root' })
export class UserEditorStoreService extends EntityStoreService<User> {}
