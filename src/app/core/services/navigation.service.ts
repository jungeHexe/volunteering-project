import { Injectable } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

/**
 * Сервис для сохранения пользовательской навигации по приложению.
 */
@Injectable({ providedIn: 'root' })
export class NavigationService {

  private static readonly EMPTY = '';
  private static readonly EDIT = 'edit';
  private static readonly BUILD = 'build';
  private static readonly INTERNAL = 'internal';

  private readonly buff = 16;
  private readonly history: string[] = [];
  private lastRemovedRoute: string = null;

  constructor(
    private readonly router: Router,
  ) {
    this.router.events
      .pipe(
        filter((event: Event) => event instanceof NavigationEnd),
        map(event => (event as NavigationEnd).urlAfterRedirects),
      )
      .subscribe(url => this.saveRouteToHistory(url));
  }

  /**
   * Вернуться на предыдущий url адрес.
   */
  navigateBack(): void {
    const targetUrl: string[] = [];
    const queryParams: any = {};
    if (this.history.length > 1) {
      this.lastRemovedRoute = this.history.pop();
      const urls = this.history[this.history.length - 1].split('?');
      targetUrl.push(...urls[0].split('/'));
      if (urls.length > 1) {
        const params = urls[1].split('&');
        params.forEach(p => {
          const param = p.split('=');
          queryParams[param[0]] = param[1];
        });
      }
    } else {
      const currentUrl = this.router.url.split('/');
      currentUrl.pop();
      const lastPath = currentUrl[currentUrl.length - 1];
      // Без истории мы просто выходим из вложенного редактора, т.к. не хватает данных для отображения страницы
      const internalIndex = currentUrl.lastIndexOf(NavigationService.INTERNAL);
      if (internalIndex !== -1) {
        currentUrl.splice(internalIndex, currentUrl.length - internalIndex);
      } else {
        if (lastPath === NavigationService.EDIT || lastPath === NavigationService.BUILD) {
          currentUrl.pop();
        }
      }
      targetUrl.push(...currentUrl);
    }
    this.router.navigate([
      '/', ...targetUrl.filter(p => !!p && p !== NavigationService.EMPTY && p !== (window as any).env?.APP_PROJECT_PATH),
    ], { queryParams }).then();
  }

 

  /**
   * Сохранить новый url адрес в историю перемещений.
   * @param url новый url адрес для сохранения в историю перемещений.
   */
  private saveRouteToHistory(url: string): void {
    if (this.history[this.history.length - 1] === url) {
      return;
    }
    this.history.push(url);
    if (this.history.length > this.buff) {
      this.history.shift();
    }
  }
}
