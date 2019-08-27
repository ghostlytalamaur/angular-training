import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlexBoxesComponent } from './flex-boxes/flex-boxes.component';

const routes: Routes = [
  { path: 'flex-boxes', component: FlexBoxesComponent },
  { path: '', redirectTo: 'dialog', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
