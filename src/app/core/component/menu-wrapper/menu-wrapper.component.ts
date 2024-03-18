import { ChangeDetectionStrategy, Component } from '@angular/core';
import {UserStoreService} from "../../stores/user-store.service";

@Component({
  selector: 'app-menu-wrapper',
  templateUrl: './menu-wrapper.component.html',
  styleUrls: ['./menu-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuWrapperComponent {

  showContainer(): boolean {
    return location.pathname !== '/';
  }

  protected readonly UserStoreService = UserStoreService;
}
