import { NgModule } from '@angular/core';
import { DialogsContainerComponent } from './dialogs-container/dialogs-container.component';
import { DialogWindowComponent } from './dialog-window/dialog-window.component';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [
    DialogsContainerComponent,
    DialogWindowComponent
  ],
  entryComponents: [
    DialogsContainerComponent,
    DialogWindowComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    DragDropModule,
    OverlayModule
  ]
})
export class DialogsModule {
}
