import {GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from "@abacritt/angularx-social-login";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import {
  TuiRootModule,
  TUI_SANITIZER,
  TUI_BUTTON_OPTIONS
} from "@taiga-ui/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {environment} from "../environments/environment";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AuthPageComponent} from "./core/component/auth-page/auth-page.component";
import {MenuWrapperComponent} from "./core/component/menu-wrapper/menu-wrapper.component";
import {CoreModule} from "./core/core.module";
import {AuthInterceptor} from "./core/interceptor/auth.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    AuthPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TuiRootModule,
    // todo хрень с роутингом?
    CoreModule,
    SocialLoginModule,
  ],
  providers: [
    {
      provide: TUI_BUTTON_OPTIONS,
      useValue: {
        appearance: 'primary',
        size: 's',
      },
    },
    {provide: TUI_SANITIZER, useClass: NgDompurifySanitizer},
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.clientId),
          },
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
