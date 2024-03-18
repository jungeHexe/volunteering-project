import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {AuthentificationService} from "../services/authentification.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private authentificationService: AuthentificationService,
    ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
    ): Observable<HttpEvent<any>> {
      if (request.headers.get('No-Auth') === 'True') {
        return next.handle(request.clone());
      }

      if (this.authentificationService.token != null) {
        const clonedreq = request.clone({
          setHeaders: {
            Authorization: `Bearer ${this.authentificationService.token}`,
          },
        });
        return next.handle(clonedreq);
      } else {
        this.router.navigateByUrl('/');
        return next.handle(request.clone());
      }
  }
}
