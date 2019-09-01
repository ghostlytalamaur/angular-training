import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SampleDialogContentComponent } from './dialog-sample/sample-dialog-content.component';
import { DialogsModule } from '../dialogs/dialogs.module';
import { RouterModule } from '@angular/router';
import { DialogWindowSampleComponent } from './dialog-sample/dialog-window-sample.component';
import { MatButtonModule, MatDialogModule } from '@angular/material';


@NgModule({
  declarations: [
    DialogWindowSampleComponent,
    SampleDialogContentComponent
  ],
  entryComponents: [
    SampleDialogContentComponent
  ],
  imports: [
    CommonModule,
    DialogsModule,
    MatButtonModule,
    MatDialogModule,
    RouterModule.forChild([{ path: 'dialogs', component: DialogWindowSampleComponent }]),
  ]
})
export class DialogsSampleModule {
}
