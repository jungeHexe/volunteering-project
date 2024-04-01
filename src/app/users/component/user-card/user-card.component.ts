import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  OnInit
} from '@angular/core';
import {Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {untilDestroyed} from "@ngneat/until-destroy";
import {TuiAlertService, TuiDialogService} from "@taiga-ui/core";
import {TuiFileLike} from "@taiga-ui/kit";
import {distinctUntilChanged, Observable} from "rxjs";
import { UserStoreService } from 'src/app/core/stores/user-store.service';
import {SERVER_URL} from "../../../app.constants";
import {BaseEditorComponent} from "../../../core/component/base-editor.component";
import {CustomFormControl} from "../../../core/component/custom-form.control";
import {FileInputModalComponent} from "../../../core/component/modals/file-input-modal/file-input-modal.component";
import {OperationResult} from "../../../core/domain/operation-result.model";
import {User, UserControlNames} from "../../../core/domain/user.model";
import {NavigationService} from "../../../core/services/navigation.service";
import {PolymorpheusComponent} from '@tinkoff/ng-polymorpheus';
import {SelectorService} from "../../../core/services/selector.service";
import {FormUtils} from "../../../core/utils/form-utils";
import {UsersService} from "../../service/users.service";
import {UserEditorStoreService} from "../../store/user-editor-store.service";

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent extends BaseEditorComponent<User> implements OnInit, AfterViewInit {

  override readonly CONTROL_NAMES = UserControlNames;
  readonly items$ = this.selectorService.getSkills();
  dialog: Observable<any> = null;

  constructor(
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector,
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    router: Router,
    route: ActivatedRoute,
    navigationService: NavigationService,
    readonly usersService: UsersService,
    readonly userEditorStoreService: UserEditorStoreService,
    readonly selectorService: SelectorService,
  ) {
    super(router, route, navigationService, usersService, userEditorStoreService);

    if (!this.entityStoreService.loadedEntity) {
      this.entityStoreService.loadedEntity = new User(this.entityStoreService.entity ?? {
        localObject: true,
      });
    }

    if (this.entityStoreService.loadedEntity && !this.entityStoreService.entity) {
      this.entityStoreService.entity = new User(this.entityStoreService.loadedEntity);
    }
  }

  ngOnInit(): void {
    const entity = this.entityStoreService.entity;
    const controls = {
      [this.CONTROL_NAMES.LAST_NAME]: new CustomFormControl(entity.lastName, [
        Validators.required,
      ]),
      [this.CONTROL_NAMES.ABOUT]: new CustomFormControl(entity.about),
      [this.CONTROL_NAMES.FIRST_NAME]: new CustomFormControl(entity.firstName, [
        Validators.required,
      ]),
      [this.CONTROL_NAMES.MIDDLE_NAME]: new CustomFormControl(entity.middleName),
      [this.CONTROL_NAMES.EMAIL]: new CustomFormControl({
        value: entity.email,
        disabled: true,
      }),
      [this.CONTROL_NAMES.SKILLS]: new CustomFormControl(entity.skills),
      [this.CONTROL_NAMES.AVATAR]: new CustomFormControl(entity.avatar),
    };
    this.addControls(controls);

    // todo if not currentuser - readonly

    this.dialog = this.dialogs.open<TuiFileLike>(
      new PolymorpheusComponent(FileInputModalComponent, this.injector),
      {
        data: `${SERVER_URL}users/${this.entityStoreService.entity.id}/update-avatar`,
        dismissible: true,
        label: 'Выбор аватара',
      },
    )
  }

  ngAfterViewInit(): void {
    this.formGroup.valueChanges
      .pipe(
        distinctUntilChanged(),
        untilDestroyed(this),
      )
      .subscribe(() => {
        const formObject = FormUtils.mapFormToObject(this.formGroup, User, this.entityStoreService.entity);
        this.entityStoreService.entity = new User(formObject);
      });
  }

  protected override beforeSaveActions(createNext: boolean = false): void {
    UserStoreService.setUser(this.entityStoreService.entity);
    super.beforeSaveActions(createNext);
  }

  protected override processSaveResult(result: OperationResult, createNext: boolean = false) {
  }

  updateAvatar(): void {
    this.dialog.subscribe({
      next: data => {
        this.getControl(this.CONTROL_NAMES.AVATAR).setValue(User.toClientObject(data).avatar);
        this.alerts.open('Аватар обновлен').subscribe();
        UserStoreService.setUser(this.entityStoreService.entity);
      },
    });
  }
}
