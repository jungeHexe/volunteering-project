import {NgOptimizedImage} from "@angular/common";
import { NgModule } from '@angular/core';
import {CoreModule} from "../core/core.module";

import { UsersRoutingModule } from './users-routing.module';
import { UserCardComponent } from './component/user-card/user-card.component';


@NgModule({
  declarations: [
    UserCardComponent,
  ],
  imports: [
    CoreModule,
    UsersRoutingModule,
    NgOptimizedImage,
  ]
})
export class UsersModule { }
