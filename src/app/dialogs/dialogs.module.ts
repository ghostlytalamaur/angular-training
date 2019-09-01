import { NgModule } from '@angular/core';
import { DialogWindowComponent } from './dialog-window/dialog-window.component';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { OverlayModule } from '@angular/cdk/overlay';
import { DialogActionsComponent } from './dialog-window/dialog-actions/dialog-actions.component';
import { DialogComponent } from './dialog-window/dialog/dialog.component';
import { PortalModule } from '@angular/cdk/portal';
import { DialogCloseDirective, DialogContentDirective } from './dialog-window/dialog.directive';

@NgModule({
  declarations: [
    DialogWindowComponent,
    DialogComponent,
    DialogActionsComponent,
    DialogCloseDirective,
    DialogContentDirective
  ],
  entryComponents: [
    DialogWindowComponent
  ],
  exports: [
    DialogComponent,
    DialogActionsComponent,
    DialogCloseDirective,
    DialogContentDirective
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    DragDropModule,
    OverlayModule,
    MatIconModule,
    PortalModule
  ]
})
export class DialogsModule {
}
