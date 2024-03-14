import { SocialAuthService} from "@abacritt/angularx-social-login";
import {HttpClient} from "@angular/common/http";
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {switchMap} from "rxjs";
import {AppConstants, SERVER_URL} from "../../../app.constants";
import {AuthentificationService, AuthParams} from "../../services/authentification.service";

@UntilDestroy()
@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPageComponent implements OnInit {


  constructor(
    private readonly router: Router,
    private readonly socialAuthService: SocialAuthService,
    private readonly httpClient: HttpClient,
    private readonly authentificationService: AuthentificationService,
  ) { }

  ngOnInit() {
    this.socialAuthService.authState
      .pipe(
        switchMap(user =>
        this.httpClient.get(`${SERVER_URL}auth/google`, {params: {idToken: user.idToken}})),
        untilDestroyed(this),
      ).subscribe((value: Partial<AuthParams>) => {
        this.authentificationService.token = value.token;
        this.router.navigate([AppConstants.USERS, value.userId]).then();
      });
  }
}
