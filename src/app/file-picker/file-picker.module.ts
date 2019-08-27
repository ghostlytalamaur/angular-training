import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatProgressBarModule,
  MatTreeModule
} from '@angular/material';
import { FilePickerComponent } from './file-picker.component';
import { BytesPipe } from './pipes/bytes.pipe';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    FilePickerComponent,
    BytesPipe
  ],
  imports: [
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    CommonModule,
    MatFormFieldModule,
    MatExpansionModule,
    RouterModule.forChild([{ path: 'file-picker', component: FilePickerComponent }]),
    MatProgressBarModule
  ]
})
export class FilePickerModule {
}
