import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {TuiLetModule} from "@taiga-ui/cdk";
import {
  TuiAlertModule,
  TuiButtonModule, TuiDataListModule,
  TuiDialogModule,
  TuiSvgModule,
  TuiTextfieldControllerModule
} from "@taiga-ui/core";
import {
  TuiAvatarModule, TuiDataListWrapperModule,
  TuiInputFilesModule,
  TuiInputModule,
  TuiMultiSelectModule, TuiTextareaModule
} from "@taiga-ui/kit";
import {MenuWrapperComponent} from "./component/menu-wrapper/menu-wrapper.component";
import { FileInputModalComponent } from './component/modals/file-input-modal/file-input-modal.component';

const tuiModules = [
  TuiSvgModule,
  TuiDialogModule,
  TuiAlertModule,
  TuiButtonModule,
  TuiAvatarModule,
  TuiInputFilesModule,
  TuiInputModule,
  TuiTextfieldControllerModule,
  TuiMultiSelectModule,
  TuiDataListModule,
  TuiDataListWrapperModule,
  TuiTextareaModule,
  TuiLetModule,
  TuiDialogModule,
];

@NgModule({
  declarations: [
    MenuWrapperComponent,
    FileInputModalComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ...tuiModules,
  ],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MenuWrapperComponent,
    ...tuiModules,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CoreModule { }
