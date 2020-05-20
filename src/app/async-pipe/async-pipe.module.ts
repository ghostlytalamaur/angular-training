import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncPipeComponentComponent } from './async-pipe-component/async-pipe-component.component';
import { RouterModule } from '@angular/router';
import { AsyncPipeChildComponentComponent } from './async-pipe-child-component/async-pipe-child-component.component';


@NgModule({
  declarations: [AsyncPipeComponentComponent, AsyncPipeChildComponentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: 'async', component: AsyncPipeComponentComponent }]),
  ]
})
export class AsyncPipeModule { }
