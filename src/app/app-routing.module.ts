import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppConstants} from "./app.constants";
import {AuthPageComponent} from "./core/component/auth-page/auth-page.component";

const routes: Routes = [{
  path: AppConstants.EMPTY,
  children: [
    {
      path: AppConstants.EMPTY,
      component: AuthPageComponent,
      pathMatch: 'full',
    },
    {
      path: AppConstants.USERS,
      // canActivate: [QuarterlyReportGuard],
      data: {
        // breadcrumb: {
        //   label: AppBreadcrumbs.TITLE_PAGES,
        // },
        // icon: AppMenuIcons.TITLE_PAGES,
        // iconClass: IconColorClasses.Grey,
      },
      loadChildren: () => import('./users/users.module')
        .then(m => m.UsersModule),
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
