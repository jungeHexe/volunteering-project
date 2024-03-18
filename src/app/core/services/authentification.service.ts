import {SocialAuthService} from "@abacritt/angularx-social-login";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import {UserStoreService} from "../stores/user-store.service";

export interface AuthParams {
  token: string;
  userId: string;
  expires: number;
}

@Injectable({providedIn: 'root'})
export class AuthentificationService {
  private readonly token$ = new BehaviorSubject<string>(null);

  constructor(
    private readonly authService: SocialAuthService,
  ) {
    const savedToken = sessionStorage.getItem('user-token');
    if (savedToken) {
      this.token$.next(savedToken);
    }
  }
  get token() {
    return this.token$.value;
  }

  set token(token: string) {
    // todo небезопасно
    sessionStorage.setItem('user-token', token);
    this.token$.next(token);
  }

  logout(): void {
    this.authService.signOut();
    UserStoreService.setUser(null);
    this.token = null;
  }
}
