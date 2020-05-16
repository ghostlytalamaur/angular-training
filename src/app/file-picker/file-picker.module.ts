import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTreeModule } from '@angular/material/tree';
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
