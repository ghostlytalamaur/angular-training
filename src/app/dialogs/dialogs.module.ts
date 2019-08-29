import { NgModule } from '@angular/core';
import { DialogsContainerComponent } from './dialogs-container/dialogs-container.component';
import { DialogWindowComponent } from './dialog-window/dialog-window.component';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { OverlayModule } from '@angular/cdk/overlay';
import { DialogCloseDirective } from './dialog-window/dialog-close.directive';
import { DialogActionsComponent } from './dialog-window/dialog-actions/dialog-actions.component';
import { DialogContentComponent } from './dialog-window/dialog-content/dialog-content.component';

@NgModule({
  declarations: [
    DialogsContainerComponent,
    DialogWindowComponent,
    DialogCloseDirective,
    DialogActionsComponent,
    DialogContentComponent
  ],
  entryComponents: [
    DialogsContainerComponent,
    DialogWindowComponent
  ],
  exports: [
    DialogCloseDirective,
    DialogActionsComponent,
    DialogContentComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    DragDropModule,
    OverlayModule,
    MatIconModule
  ]
})
export class DialogsModule {
}
