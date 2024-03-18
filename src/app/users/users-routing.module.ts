import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppConstants, ObjectFormState} from "../app.constants";
import {UserCardComponent} from "./component/user-card/user-card.component";
import {UserResolver} from "./resolver/user.resolver";

const routes: Routes = [
  {
    path: `${AppConstants.EMPTY}${AppConstants.ID_PARAM}`,
    // todo
    // canActivate: [AuthGuard],
    component: UserCardComponent,
    data: {
      currentAction: ObjectFormState.READ,
    },
    resolve: {
      profile: UserResolver,
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
