import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private readonly authenticationService: AuthentificationService,
    private router: Router,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!!this.authenticationService.token) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}
